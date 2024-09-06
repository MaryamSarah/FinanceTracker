import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert'; // Import Alert component from MUI
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // State for message
  const [messageType, setMessageType] = useState(''); // State for message type (success or error)
  const navigate = useNavigate();

  // Validate username and password before making the request
  const validateForm = () => {
    if (!username || !password) {
      setMessage('Username and password are required');
      setMessageType('error');
      return false;
    }
    if (username.length < 5 || username.length > 20) {
      setMessage('Username must be between 5 and 20 characters');
      setMessageType('error');
      return false;
    }
    return true;
  };

  const handleLogin = (event) => {
    event.preventDefault();
    
    // Validate form inputs
    if (!validateForm()) return;

    const loginData = { username, password };

    fetch('http://localhost:8080/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    .then(response => {
      if (response.ok) {
        setMessage('Login successful');
        setMessageType('success');
        navigate('/dashboard'); // Redirect to dashboard or other page
      } else {
        // Check if the response is JSON
        return response.text().then(text => {
          try {
            const data = JSON.parse(text);
            setMessage('Invalid username or password');
          } catch (e) {
            setMessage('Invalid username or password'); // Default error message
          }
          setMessageType('error');
        });
      }
    })
    .catch(error => {
      setMessage('Invalid username or password'); // Default error message
      setMessageType('error');
    });
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'url("https://cdn.corporatefinanceinstitute.com/assets/accounting-transactions.jpeg")',
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Box 
        sx={{ 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          borderRadius: '8px', 
          maxWidth: '500px',
          width: '100%' 
        }}
      >
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom
          style={{ fontWeight: 'bold', color: 'black' }} // Override MUI theme with inline styles
        >
          Login
        </Typography>
        
        {message && (
          <Box 
            sx={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2 // Margin bottom to space out from other elements
            }}
          >
            <Alert 
              severity={messageType === 'success' ? 'success' : 'error'}
              sx={{ 
                width: '100%',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                textAlign: 'center',
              }} // Center the alert content
            >
              {message}
            </Alert>
          </Box>
        )}

        <TextField 
          id="outlined-basic" 
          label="Username" 
          variant="outlined" 
          style={{ width: '400px' }} // Override MUI theme with inline styles
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField 
          id="outlined-basic" 
          label="Password" 
          variant="outlined" 
          type="password" 
          style={{ width: '400px' }} // Override MUI theme with inline styles
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button 
          onClick={handleLogin} 
          variant="contained" 
          color="primary"
          style={{ width: '400px' }} // Override MUI theme with inline styles
        >
          Login
        </Button>
        <Typography 
          variant="body1" 
          style={{ marginTop: '16px', color: 'black' }} // Override MUI theme with inline styles
        >
          Don't have an account?{' '}
          <Button 
            onClick={() => navigate('/signup')} 
            variant="text" 
            color="primary"
          >
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
