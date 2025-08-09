import React, { useEffect } from 'react'
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  Stack,
} from '@mui/material'
import { FormField, FormData } from '../types/form'
import { validateField, calculateDerivedValue } from '../utils/validation'

interface FormRendererProps {
  fields: FormField[]
  formData: FormData
  errors: Record<string, string>
  onChange: (data: FormData) => void
  onValidationChange: (errors: Record<string, string>) => void
}

const FormRenderer: React.FC<FormRendererProps> = ({ 
  fields, 
  formData, 
  errors, 
  onChange, 
  onValidationChange 
}) => {

  // Update derived fields when parent fields change
  useEffect(() => {
    const newFormData = { ...formData }
    let hasChanges = false

    fields.forEach(field => {
      if (field.isDerived && field.derivedConfig) {
        const newValue = calculateDerivedValue(field, formData, fields)
        if (newValue !== formData[field.id]) {
          newFormData[field.id] = newValue
          hasChanges = true
        }
      }
    })

    if (hasChanges) {
      onChange(newFormData)
    }
  }, [formData, fields, onChange])

  // Validate fields on change
  useEffect(() => {
    const newErrors: Record<string, string> = {}
    
    fields.forEach(field => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    onValidationChange(newErrors)
  }, [formData, fields, onValidationChange])

  const handleFieldChange = (fieldId: string, value: any) => {
    onChange({
      ...formData,
      [fieldId]: value
    })
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || field.defaultValue || ''
    const error = errors[field.id]
    const isDisabled = field.isDerived

    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            type="text"
            label={field.label}
            value={value}
            onChange={(e) => {
              const newValue = e.target.value
              // Only allow text for text fields
              if (typeof newValue === 'string') {
                handleFieldChange(field.id, newValue)
              }
            }}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={isDisabled}
          />
        )

      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            label={field.label}
            value={value === null ? '' : value}
            onChange={(e) => {
              const newValue = e.target.value === '' ? null : Number(e.target.value)
              // Only set if it's a valid number or null
              if (newValue === null || !isNaN(newValue)) {
                handleFieldChange(field.id, newValue)
              }
            }}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={isDisabled}
            inputProps={{ step: "any" }}
          />
        )

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={isDisabled}
          />
        )

      case 'select':
        return (
          <FormControl fullWidth error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              disabled={isDisabled}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        )

      case 'radio':
        return (
          <FormControl error={!!error}>
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={isDisabled} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        )

      case 'checkbox':
        return (
          <FormControl error={!!error}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                  disabled={isDisabled}
                />
              }
              label={field.label}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        )

      case 'date':
        return (
          <TextField
            fullWidth
            type="date"
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
            error={!!error}
            helperText={error}
            disabled={isDisabled}
            InputLabelProps={{ shrink: true }}
          />
        )

      default:
        return null
    }
  }

  return (
    <Stack spacing={3}>
      {fields.map((field) => (
        <Box key={field.id}>
          {renderField(field)}
          {field.isDerived && (
            <FormHelperText sx={{ mt: 0.5, color: 'info.main' }}>
              This field is automatically calculated
            </FormHelperText>
          )}
        </Box>
      ))}
    </Stack>
  )
}

export default FormRenderer
