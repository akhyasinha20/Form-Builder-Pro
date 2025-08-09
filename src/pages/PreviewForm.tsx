import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  Alert,
  Button,
} from '@mui/material'
import { RootState } from '../store/store'
import FormRenderer from '../components/FormRenderer'
import { FormData } from '../types/form'

const PreviewForm: React.FC = () => {
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)
  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    console.log('Form submitted with data:', formData)
    alert('Form submitted successfully! Check console for data.')
  }

  if (currentForm.fields.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Preview Form
        </Typography>
        <Alert severity="info">
          No form to preview. Please create a form first.
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Preview Form
      </Typography>
      
      <Paper sx={{ p: 3, maxWidth: 800 }}>
        <Typography variant="h5" gutterBottom>
          {currentForm.name || 'Untitled Form'}
        </Typography>
        
        <FormRenderer
          fields={currentForm.fields}
          formData={formData}
          errors={errors}
          onChange={setFormData}
          onValidationChange={setErrors}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0}
          >
            Submit Form
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default PreviewForm
