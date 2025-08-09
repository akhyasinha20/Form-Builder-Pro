import React from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Stack,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material'
import { FormField } from '../types/form'
import { deleteField, reorderFields } from '../store/formBuilderSlice'

interface FieldBuilderProps {
  fields: FormField[]
  onEditField: (index: number, field: FormField) => void
}

const FieldBuilder: React.FC<FieldBuilderProps> = ({ fields, onEditField }) => {
  const dispatch = useDispatch()

  const handleDeleteField = (index: number) => {
    dispatch(deleteField(index))
  }

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
      text: 'primary',
      number: 'secondary',
      textarea: 'success',
      select: 'warning',
      radio: 'info',
      checkbox: 'error',
      date: 'primary',
    }
    return colors[type] || 'default'
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Form Fields ({fields.length})
      </Typography>
      
      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Paper
            key={field.id}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: 1,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
              
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {field.label}
                  </Typography>
                  <Chip
                    label={field.type}
                    size="small"
                    color={getFieldTypeColor(field.type)}
                    variant="outlined"
                  />
                  {field.required && (
                    <Chip label="Required" size="small" color="error" variant="outlined" />
                  )}
                  {field.isDerived && (
                    <Chip label="Derived" size="small" color="info" variant="outlined" />
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {field.validationRules.length > 0 && (
                    <>Validations: {field.validationRules.map(rule => rule.type).join(', ')}</>
                  )}
                  {field.defaultValue && (
                    <>Default: {String(field.defaultValue)}</>
                  )}
                </Typography>
              </Box>

              <Box>
                <IconButton
                  size="small"
                  onClick={() => onEditField(index, field)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteField(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  )
}

export default FieldBuilder
