import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, useTheme, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

function EditCategory() {
  const { id } = useParams(); // Get the category ID from the URL
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme

  const [category, setCategory] = useState({
    name: '',
    type: ''
  });

  const [error, setError] = useState(''); // Track validation or update errors

  useEffect(() => {
    // Fetch the category details when the component mounts
    fetch(`http://localhost:8080/category/get/${id}`)
      .then(response => response.json())
      .then(data => setCategory(data))
      .catch(error => console.error('Error fetching category data:', error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({
      ...category,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate category data (e.g., ensure name is not empty, type is valid)
    if (!category.name || !category.type) {
      setError('Please fill out all required fields.');
      return;
    }
    setError(''); // Clear error before submitting

    // Update the category details
    fetch(`http://localhost:8080/category/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    })
      .then(response => {
        if (response.ok) {
          navigate('/categories'); // Redirect to the categories page
        } else {
          return response.json(); // If there's an error, parse the response for details
        }
      })
      .then(data => {
        if (data) {
          setError(data.message || 'Category name exists'); // Show backend error message
        }
      })
      .catch(error => {
        console.error('Error updating category:', error);
        setError('Category cannot be updated as it is associated with one or more transactions');
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
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 8 }}>
        Edit Category
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 600,
          mt: 4,
          '& .MuiTextField-root': { mb: 2, width: '100%' },
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
          InputProps={{
            style: { color: theme.palette.text.primary }
          }}
          InputLabelProps={{
            style: { color: theme.palette.text.secondary }
          }}
        />
        <TextField
          label="Type"
          variant="outlined"
          name="type"
          value={category.type}
          onChange={handleChange}
          select
          InputProps={{
            style: { color: theme.palette.text.primary, textAlign: 'left' }
          }}
          InputLabelProps={{
            style: { color: theme.palette.text.secondary }
          }}
        >
          <MenuItem value="INCOME">Income</MenuItem>
          <MenuItem value="EXPENSE">Expense</MenuItem>
        </TextField>
        {error && <Typography color="error">{error}</Typography>}
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

export default EditCategory;
