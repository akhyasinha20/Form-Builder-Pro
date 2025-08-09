import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Chip,
  Stack,
  Paper,
  IconButton,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { FormField, FieldType, ValidationRule, SelectOption, DerivedField } from '../types/form'
import { updateField } from '../store/formBuilderSlice'
import { RootState } from '../store/store'

interface FieldEditorProps {
  field?: FormField
  fieldIndex?: number
  onSave: (field: FormField) => void
  onCancel: () => void
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, fieldIndex, onSave, onCancel }) => {
  const dispatch = useDispatch()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)
  
  const [formData, setFormData] = useState<FormField>({
    id: field?.id || Date.now().toString(),
    type: field?.type || 'text',
    label: field?.label || '',
    required: field?.required || false,
    defaultValue: field?.defaultValue || '',
    validationRules: field?.validationRules || [],
    options: field?.options || [],
    isDerived: field?.isDerived || false,
    derivedConfig: field?.derivedConfig,
  })

  const [newValidation, setNewValidation] = useState<Partial<ValidationRule>>({
    type: 'required',
    message: '',
  })

  const [newOption, setNewOption] = useState<SelectOption>({ label: '', value: '' })

  const handleSave = () => {
    if (fieldIndex !== undefined) {
      dispatch(updateField({ index: fieldIndex, field: formData }))
    }
    onSave(formData)
  }

  const addValidationRule = () => {
    if (newValidation.type && newValidation.message) {
      setFormData(prev => ({
        ...prev,
        validationRules: [...prev.validationRules, newValidation as ValidationRule]
      }))
      setNewValidation({ type: 'required', message: '' })
    }
  }

  const removeValidationRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      validationRules: prev.validationRules.filter((_, i) => i !== index)
    }))
  }

  const addOption = () => {
    if (newOption.label && newOption.value) {
      setFormData(prev => ({
        ...prev,
        options: [...(prev.options || []), newOption]
      }))
      setNewOption({ label: '', value: '' })
    }
  }

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index) || []
    }))
  }

  const availableParentFields = currentForm.fields.filter(f => f.id !== formData.id && !f.isDerived)

  return (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={3}>
        {/* Basic Field Configuration */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Basic Configuration</Typography>
          
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={formData.type}
                label="Field Type"
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as FieldType }))}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="textarea">Textarea</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="radio">Radio</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Field Label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              required
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.required}
                  onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                />
              }
              label="Required Field"
            />

            <TextField
              fullWidth
              label="Default Value"
              value={formData.defaultValue}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
            />
          </Stack>
        </Paper>

        {/* Options for Select/Radio fields */}
        {(formData.type === 'select' || formData.type === 'radio') && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Options</Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  label="Option Label"
                  value={newOption.label}
                  onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                />
                <TextField
                  label="Option Value"
                  value={newOption.value}
                  onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                />
                <Button variant="outlined" onClick={addOption} startIcon={<AddIcon />}>
                  Add
                </Button>
              </Box>

              <Stack spacing={1}>
                {formData.options?.map((option, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={`${option.label} (${option.value})`} />
                    <IconButton size="small" onClick={() => removeOption(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Validation Rules */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Validation Rules</Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'end' }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={newValidation.type}
                  label="Rule Type"
                  onChange={(e) => setNewValidation(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <MenuItem value="required">Required</MenuItem>
                  <MenuItem value="notEmpty">Not Empty</MenuItem>
                  <MenuItem value="minLength">Min Length</MenuItem>
                  <MenuItem value="maxLength">Max Length</MenuItem>
                  <MenuItem value="email">Email Format</MenuItem>
                  <MenuItem value="password">Password</MenuItem>
                </Select>
              </FormControl>

              {(newValidation.type === 'minLength' || newValidation.type === 'maxLength') && (
                <TextField
                  label="Value"
                  type="number"
                  value={newValidation.value || ''}
                  onChange={(e) => setNewValidation(prev => ({ ...prev, value: parseInt(e.target.value) }))}
                />
              )}

              <TextField
                label="Error Message"
                value={newValidation.message}
                onChange={(e) => setNewValidation(prev => ({ ...prev, message: e.target.value }))}
                sx={{ flexGrow: 1 }}
              />

              <Button variant="outlined" onClick={addValidationRule} startIcon={<AddIcon />}>
                Add
              </Button>
            </Box>

            <Stack spacing={1}>
              {formData.validationRules.map((rule, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`${rule.type}${rule.value ? `: ${rule.value}` : ''} - ${rule.message}`}
                    variant="outlined"
                  />
                  <IconButton size="small" onClick={() => removeValidationRule(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Paper>

        {/* Derived Field Configuration */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Derived Field</Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.isDerived}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isDerived: e.target.checked,
                  derivedConfig: e.target.checked ? { parentFields: [], formula: '', logic: 'custom' } : undefined
                }))}
              />
            }
            label="This is a derived field"
          />

          {formData.isDerived && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Logic Type</InputLabel>
                <Select
                  value={formData.derivedConfig?.logic || 'custom'}
                  label="Logic Type"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    derivedConfig: {
                      ...prev.derivedConfig!,
                      logic: e.target.value as any
                    }
                  }))}
                >
                  <MenuItem value="age_from_dob">Age from Date of Birth</MenuItem>
                  <MenuItem value="sum">Sum of Numbers</MenuItem>
                  <MenuItem value="concat">Concatenate Text</MenuItem>
                  <MenuItem value="custom">Custom Formula</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Formula/Logic"
                value={formData.derivedConfig?.formula || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  derivedConfig: {
                    ...prev.derivedConfig!,
                    formula: e.target.value
                  }
                }))}
                placeholder="e.g., field1 + field2 or custom logic"
                multiline
                rows={2}
              />

              <Typography variant="body2" color="text.secondary">
                Available parent fields: {availableParentFields.map(f => f.label).join(', ')}
              </Typography>
            </Stack>
          )}
        </Paper>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!formData.label.trim()}
          >
            {field ? 'Update Field' : 'Add Field'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default FieldEditor
