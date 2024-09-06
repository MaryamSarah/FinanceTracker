import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddTransaction() {
  const theme = useTheme(); // Use the theme from context
  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    categoryName: '',
    transactionDate: '',
    type: ''
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Hook to handle navigation

  useEffect(() => {
    // Fetch categories from the API
    fetch('http://localhost:8080/category/getAll')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({
      ...transaction,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Check for required fields first
    if (!transaction.description) newErrors.description = 'Description is required';
    if (!transaction.amount) {
      newErrors.amount = 'Amount is required'; // Check if amount is missing
    } else if (transaction.amount <= 0) {
      newErrors.amount = 'Amount must be a positive number'; // Check if amount is not positive
    }
    if (!transaction.categoryName) newErrors.categoryName = 'Category is required';
    if (!transaction.transactionDate) newErrors.transactionDate = 'Date and Time is required';
    if (!transaction.type) newErrors.type = 'Type is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    fetch('http://localhost:8080/transaction/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    })
    .then(response => {
      if (response.ok) {  // Check if the response is 200 OK
        console.log('Transaction added successfully');
        navigate('/transactions'); // Redirect to the transactions page
      } else {
        console.error('Failed to add transaction');
      }
    })
    .catch(error => {
      console.error('Error adding transaction:', error);
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
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{ color: theme.palette.text.primary }} // Ensure good contrast
      >
        Add Transaction
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
          label="Description"
          variant="outlined"
          name="description"
          value={transaction.description}
          onChange={handleChange}
          multiline
          maxRows={4}
          error={!!errors.description}
          helperText={errors.description}
          sx={{ 
            backgroundColor: theme.palette.background.default,
            '& .MuiInputBase-input': { color: theme.palette.text.primary }
          }}
        />
        <TextField
          label="Amount"
          variant="outlined"
          name="amount"
          type="number"
          value={transaction.amount}
          onChange={handleChange}
          error={!!errors.amount}
          helperText={errors.amount}
          sx={{ 
            backgroundColor: theme.palette.background.default,
            '& .MuiInputBase-input': { color: theme.palette.text.primary }
          }}
        />
        <TextField
          label="Category"
          variant="outlined"
          name="categoryName"
          value={transaction.categoryName}
          onChange={handleChange}
          error={!!errors.categoryName}
          helperText={errors.categoryName}
          select
          sx={{ 
            backgroundColor: theme.palette.background.default, textAlign:'left',
            '& .MuiInputBase-input': { color: theme.palette.text.primary }
          }}
        >
          {categories.map(category => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Date and Time"
          variant="outlined"
          name="transactionDate"
          type="datetime-local"
          value={transaction.transactionDate}
          onChange={handleChange}
          error={!!errors.transactionDate}
          helperText={errors.transactionDate}
          InputLabelProps={{ shrink: true }}
          sx={{ 
            backgroundColor: theme.palette.background.default,
            '& .MuiInputBase-input': { color: theme.palette.text.primary }
          }}
        />
        <TextField
          label="Type"
          variant="outlined"
          name="type"
          value={transaction.type}
          onChange={handleChange}
          select
          error={!!errors.type}
          helperText={errors.type}
          sx={{ 
            backgroundColor: theme.palette.background.default, textAlign:'left',
            '& .MuiInputBase-input': { color: theme.palette.text.primary }
          }}
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

export default AddTransaction;
