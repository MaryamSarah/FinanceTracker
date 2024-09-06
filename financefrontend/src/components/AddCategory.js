import React, { useState } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // Import useTheme from MUI
import { useThemeContext } from './ThemeContext'; // Import your theme context

function AddCategory() {
  const [category, setCategory] = useState({
    name: '',
    type: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    type: '',
  });

  const { mode, toggleTheme } = useThemeContext(); // Use theme context for mode and toggle
  const theme = useTheme(); // Get MUI's theme
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({
      ...category,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    let isValid = true;
    const newErrors = { name: '', type: '' };

    if (!category.name.trim()) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    if (!category.type.trim()) {
      newErrors.type = 'Type is required.';
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    fetch('http://localhost:8080/category/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    })
      .then(response => {
        if (response.ok) {
          console.log('Category added successfully');
          navigate('/categories'); // Redirect to the categories page
        } else if (response.status === 500) { // Check for 500 error from the server
          setErrors(prevErrors => ({
            ...prevErrors,
            name: 'Category name already exists.'
          }));
        } else {
          console.error('Failed to add category');
          setErrors(prevErrors => ({
            ...prevErrors,
            name: 'Failed to add category.'
          }));
        }
      })
      .catch(error => {
        console.error('Error adding category:', error);
        setErrors(prevErrors => ({
          ...prevErrors,
          name: 'Error adding category.'
        }));
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        overflow: 'auto',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Add Category
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 600,
          mt: 3,
          '& .MuiTextField-root': { mb: 2, width: '100%' }
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={category.name}
          onChange={handleChange}
          multiline
          maxRows={4}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}
        />
        <TextField
          label="Type"
          variant="outlined"
          name="type"
          value={category.type}
          onChange={handleChange}
          select
          error={!!errors.type}
          helperText={errors.type}
          InputProps={{
            style: { textAlign: 'left', color: theme.palette.text.primary } // Align text and set color to primary
          }}
          sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary }}
        >
          <MenuItem value="INCOME">Income</MenuItem>
          <MenuItem value="EXPENSE">Expense</MenuItem>
        </TextField>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}

export default AddCategory;
