import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import { useTheme } from '@mui/material';
import BasicTableCat from './BasicTableCat';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useThemeContext } from './ThemeContext'; // Import your theme context

export default function Categories() {
  const { mode, toggleTheme } = useThemeContext(); // Use theme context
  const theme = useTheme(); // Get current theme
  const [pathname, setPathname] = React.useState('categories');
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [tabValue, setTabValue] = React.useState('3');
  const [categories, setCategories] = React.useState([]);
  const navigate = useNavigate();

  const handleSidebarToggle = () => {
    setSidebarOpen((prevOpen) => !prevOpen);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === '1') {
      navigate('/dashboard');
    } else if (newValue === '2') {
      navigate('/transactions');
    } else if (newValue === '3') {
      navigate('/categories');
    }
  };

  const handleSelect = (segment) => {
    setPathname(segment);
    navigate(`/${segment}`);
  };

  const handleAddCategory = () => {
    navigate('/category/add');
  };

  const refreshCategories = () => {
    fetch('http://localhost:8080/category/getAll')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    refreshCategories(); // Initial fetch
  }, []);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        bgcolor: theme.palette.background.default, // Dynamically apply theme
        color: theme.palette.text.primary, // Dynamically apply text color based on theme
      }}
    >
      <Appbar onSidebarToggle={handleSidebarToggle} mode={mode} toggleTheme={toggleTheme} />
      <Box 
        sx={{ 
          display: 'flex', 
          flexGrow: 1, 
          marginTop: 0, 
          zIndex: 900, 
          width: '100%', 
          height: '100%', 
          position: 'fixed', 
          padding: 0, 
          overflow: 'scroll',
          bgcolor: theme.palette.background.default, // Ensure theme background is applied
          color: theme.palette.text.primary, // Ensure theme text color is applied
        }}
      >
        <Sidebar
          onSelect={handleSelect}
          open={sidebarOpen}
        />
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.background.paper, // Apply theme to paper background
            color: theme.palette.text.primary, // Ensure text follows theme
            marginTop: 0,
          }}
        >
          <Box sx={{ width: '100%', mb: 8, mt: 12 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="category tabs">
              <Tab label="Dashboard" value="1" />
              <Tab label="Transactions" value="2" />
              <Tab label="Categories" value="3" />
            </Tabs>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, mt: -3, width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
              sx={{ mb: 2, width: '100%' }}
            >
              Add New Category
            </Button>
          </Box>
          <Box sx={{ width: '100%', mb: 1, mt: 2 }}>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                textAlign: 'left',
                ml: 3,
                mb: 1 
              }}
            >
              Categories
            </Typography>
          </Box>
          <BasicTableCat categories={categories} onCategoryDeleted={refreshCategories} sx={{ mt: 1 }} />
        </Box>
      </Box>
    </Box>
  );
}
