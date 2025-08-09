import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { Add as AddIcon, Preview as PreviewIcon, ListAlt as ListAltIcon } from '@mui/icons-material'

const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const navItems = [
    { label: 'Create Form', path: '/create', icon: <AddIcon /> },
    { label: 'Preview', path: '/preview', icon: <PreviewIcon /> },
    { label: 'My Forms', path: '/myforms', icon: <ListAltIcon /> },
  ]

  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderRadius: 0
      }}
    >
      <Toolbar>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FFF 30%, #E3F2FD 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Form Builder Pro
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {navItems.map((item) => (
            isMobile ? (
              <IconButton
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                {item.icon}
              </IconButton>
            ) : (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                variant={location.pathname === item.path ? 'contained' : 'text'}
                sx={{
                  borderRadius: '20px',
                  px: 3,
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  textTransform: 'none',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                }}
              >
                {item.label}
              </Button>
            )
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
