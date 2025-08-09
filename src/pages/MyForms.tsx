import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Alert,
} from '@mui/material'
import { Visibility as ViewIcon, Edit as EditIcon } from '@mui/icons-material'
import { RootState } from '../store/store'
import { loadSavedForms, loadForm } from '../store/formBuilderSlice'

const MyForms: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { savedForms } = useSelector((state: RootState) => state.formBuilder)

  useEffect(() => {
    dispatch(loadSavedForms())
  }, [dispatch])

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId))
    navigate('/preview')
  }

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId))
    navigate('/create')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Forms
      </Typography>

      {savedForms.length === 0 ? (
        <Alert severity="info">
          No saved forms yet. Create your first form to see it here.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {savedForms.map((form) => (
            <Grid item xs={12} sm={6} md={4} key={form.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {form.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created: {formatDate(form.createdAt)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                    <Chip 
                      label={`${form.fields.length} fields`} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    {form.fields.some(f => f.required) && (
                      <Chip 
                        label="Has required fields" 
                        size="small" 
                        color="warning" 
                        variant="outlined" 
                      />
                    )}
                    {form.fields.some(f => f.isDerived) && (
                      <Chip 
                        label="Has derived fields" 
                        size="small" 
                        color="info" 
                        variant="outlined" 
                      />
                    )}
                  </Box>

                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Field types: {[...new Set(form.fields.map(f => f.type))].join(', ')}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => handlePreviewForm(form.id)}
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditForm(form.id)}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}

export default MyForms
