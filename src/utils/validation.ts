import { FormField, ValidationRule, FormData, FormValue, FieldType } from '../types/form'

export function validateField(field: FormField, value: FormValue): string | null {
  // Type-specific validation
  const typeError = validateType(field.type, value)
  if (typeError) return typeError

  // Rules validation
  for (const rule of field.validationRules) {
    const error = validateRule(rule, value, field.label)
    if (error) return error
  }
  return null
}

function validateType(fieldType: FieldType, value: FormValue): string | null {
  // Allow null for optional fields
  if (value === null) return null

  switch (fieldType) {
    case 'text':
    case 'textarea':
      if (typeof value !== 'string') {
        return `Invalid type: expected text but got ${typeof value}`
      }
      // Ensure no numeric strings in text fields
      if (!isNaN(Number(value)) && value !== '') {
        return 'This field should contain text, not numbers'
      }
      return null

    case 'number':
      if (value === null) return null
      if (typeof value !== 'number') {
        return `Invalid type: expected number but got ${typeof value}`
      }
      if (isNaN(value)) {
        return 'Please enter a valid number'
      }
      return null

    case 'checkbox':
      return typeof value !== 'boolean' 
        ? `Invalid type: expected boolean but got ${typeof value}` 
        : null

    case 'select':
    case 'radio':
      return typeof value !== 'string'
        ? `Invalid type: expected string but got ${typeof value}`
        : null

    case 'date':
      if (typeof value !== 'string') {
        return `Invalid type: expected date string but got ${typeof value}`
      }
      if (isNaN(Date.parse(value))) {
        return 'Please enter a valid date'
      }
      return null

    default:
      return null
  }
}

function validateRule(rule: ValidationRule, value: FormValue, fieldLabel: string): string | null {
  switch (rule.type) {
    case 'required':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return rule.message || `${fieldLabel} is required`
      }
      break

    case 'notEmpty':
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        return rule.message || `${fieldLabel} cannot be empty`
      }
      break

    case 'minLength':
      if (typeof value === 'string' && value.length < (rule.value as number)) {
        return rule.message || `${fieldLabel} must be at least ${rule.value} characters`
      }
      break

    case 'maxLength':
      if (typeof value === 'string' && value.length > (rule.value as number)) {
        return rule.message || `${fieldLabel} must be no more than ${rule.value} characters`
      }
      break

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (typeof value === 'string' && (!value || !emailRegex.test(value))) {
        return rule.message || `${fieldLabel} must be a valid email address`
      }
      break

    case 'password':
      if (typeof value === 'string' && (!value || value.length < 8 || !/\d/.test(value))) {
        return rule.message || `${fieldLabel} must be at least 8 characters and contain a number`
      }
      break
  }

  return null
}

export function calculateDerivedValue(
  field: FormField, 
  formData: FormData, 
  allFields: FormField[]
): FormValue {
  if (!field.isDerived || !field.derivedConfig) return null

  const { logic, formula, parentFields } = field.derivedConfig

  // Check if all parent fields have values
  const hasAllParentValues = parentFields.every(id => formData[id] !== undefined && formData[id] !== null)
  if (!hasAllParentValues) return null

  try {
    switch (logic) {
      case 'age_from_dob': {
        const dobField = allFields.find(f => f.id === parentFields[0] && f.type === 'date')
        if (!dobField) return null

        const dobValue = formData[dobField.id]
        if (typeof dobValue !== 'string') return null

        const dob = new Date(dobValue)
        if (isNaN(dob.getTime())) return null

        const today = new Date()
        let age = today.getFullYear() - dob.getFullYear()
        const monthDiff = today.getMonth() - dob.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--
        }
        return age
      }

      case 'sum': {
        const numberFields = parentFields
          .map(id => allFields.find(f => f.id === id))
          .filter((f): f is FormField => f !== undefined && f.type === 'number')

        if (numberFields.length === 0) return 0

        return numberFields.reduce((sum, field) => {
          const value = formData[field.id]
          if (typeof value === 'number') return sum + value
          if (typeof value === 'string') {
            const num = parseFloat(value)
            return isNaN(num) ? sum : sum + num
          }
          return sum
        }, 0)
      }

      case 'concat': {
        const textFields = parentFields
          .map(id => allFields.find(f => f.id === id))
          .filter((f): f is FormField => f !== undefined && 
            (f.type === 'text' || f.type === 'textarea'))

        return textFields
          .map(field => {
            const value = formData[field.id]
            return typeof value === 'string' ? value.trim() :
                   typeof value === 'number' ? value.toString() :
                   ''
          })
          .filter(text => text.length > 0)
          .join(' ')
      }

      case 'custom': {
        let evaluatedFormula = formula
        const fieldsInFormula = parentFields
          .map(id => allFields.find(f => f.id === id))
          .filter((f): f is FormField => f !== undefined)

        fieldsInFormula.forEach(field => {
          const value = formData[field.id]
          const regex = new RegExp(`\\{${field.label}\\}`, 'g')
          const stringValue = typeof value === 'string' ? value :
                            typeof value === 'number' ? value.toString() :
                            '0'
          evaluatedFormula = evaluatedFormula.replace(regex, stringValue)
        })

        const result = new Function(`return ${evaluatedFormula}`)()
        return typeof result === 'number' ? result :
               typeof result === 'string' ? result :
               null
      }

      default:
        return null
    }
  } catch (error) {
    console.error('Error calculating derived value:', error)
    return null
  }
}

