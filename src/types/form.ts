export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date'

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty'
  value?: number | string
  message: string
}

export interface SelectOption {
  label: string
  value: string
}

export interface DerivedField {
  parentFields: string[]
  formula: string
  logic: 'age_from_dob' | 'sum' | 'concat' | 'custom'
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  required: boolean
  defaultValue?: string | number | boolean | string[]
  validationRules: ValidationRule[]
  options?: SelectOption[] // for select, radio
  isDerived?: boolean
  derivedConfig?: DerivedField
}

export interface FormSchema {
  id: string
  name: string
  fields: FormField[]
  createdAt: string
}

export type FormValue = string | number | boolean | string[] | null

export interface FormData {
  [fieldId: string]: FormValue
}
