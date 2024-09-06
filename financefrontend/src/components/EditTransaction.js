import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function EditTransaction() {
  const { id } = useParams(); // Get the transaction ID from the URL
  const navigate = useNavigate();
  const location = useLocation(); // Get current location details

  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    categoryName: '',
    transactionDate: '',
    type: ''
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({}); // Error state for form validation

  useEffect(() => {
    // Fetch transaction details when the component mounts
    fetch(`http://localhost:8080/transaction/get/${id}`)
      .then(response => response.json())
      .then(data => setTransaction(data))
      .catch(error => console.error('Error fetching transaction data:', error));
  }, [id]);

  useEffect(() => {
    // Fetch categories from the API
    fetch('http://localhost:8080/category/getAll')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!transaction.description) newErrors.description = 'Description is required';
    if (!transaction.amount) {
      newErrors.amount = 'Amount is required';
    } else if (transaction.amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!transaction.categoryName) newErrors.categoryName = 'Category is required';
    if (!transaction.transactionDate) newErrors.transactionDate = 'Date and Time is required';
    if (!transaction.type) newErrors.type = 'Type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({
      ...transaction,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Format amount to match BigDecimal
    const formattedAmount = parseFloat(transaction.amount).toFixed(2);

    // Convert date to ISO string to match LocalDateTime format
    const formattedTransactionDate = new Date(transaction.transactionDate).toISOString();

    const updatedTransaction = {
      ...transaction,
      amount: formattedAmount,
      transactionDate: formattedTransactionDate
    };

    // Update the transaction details
    fetch(`http://localhost:8080/transaction/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTransaction)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Transaction updated:', data);
        const source = new URLSearchParams(location.search).get('source');
        if (source === '/transactions') {
          navigate('/transactions');
        } else if(source ==='/transaction/history'){
          navigate('/transaction/history');
        }else {
          navigate('/dashboard');
        }
      })
      .catch(error => console.error('Error updating transaction:', error));
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
        Edit Transaction
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: 600,
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1,
          '& .MuiTextField-root': { mb: 2, width: '100%' },
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
          sx={{ input: { color: 'text.primary' } }}
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
          sx={{ input: { color: 'text.primary' } }}
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
          sx={{ input: { color: 'text.primary' }, textAlign:'left' }}
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
          InputLabelProps={{ shrink: true }}
          error={!!errors.transactionDate}
          helperText={errors.transactionDate}
          sx={{ input: { color: 'text.primary' } }}
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
            input: { color: 'text.primary' }, 
            select: { color: 'text.primary' },
            textAlign:'left' 
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

export default EditTransaction;
