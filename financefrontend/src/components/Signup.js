import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert'; // Import Alert component from MUI
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // State for message
  const [messageType, setMessageType] = useState(''); // State for message type (success or error)
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setMessage('All fields are required');
      setMessageType('error');
      return false;
    }

    if (username.length < 5 || username.length > 20) {
      setMessage('Username must be between 5 and 20 characters');
      setMessageType('error');
      return false;
    }

    // Regex for simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email address');
      setMessageType('error');
      return false;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const signupData = { username, email, password };

    fetch('http://localhost:8080/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
    })
    .then(response => response.text().then(text => {
        if (response.ok) {
            setMessage('User signed up successfully');
            setMessageType('success');
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            navigate('/dashboard');
        } else {
            // Display detailed error messages based on the response text
            setMessage(text);
            setMessageType('error');
        }
    }))
    .catch(error => {
        setMessage('Error: ' + error.message);
        setMessageType('error');
    });
};

  

  const handleLoginRedirect = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', // Ensure the container takes up at least the full viewport height
        display: 'flex', // Use flexbox to center the form vertically
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'url("https://kenyanwallstreet.com/wp-content/uploads/2023/04/Small-Biz.jpeg")',
        backgroundSize: 'cover', // Ensure the image covers the entire background
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat' // Prevent image repetition
      }}
    >
      {/* Main Container Box */}
      <Box 
        sx={{ 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '16px', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for the form
          borderRadius: '8px', // Optional: rounded corners
          maxWidth: '500px', // Limit the width of the form to prevent it from being too wide
          width: '100%' // Ensure the form container is responsive
        }}
      >
        {/* Heading */}
        <Typography variant="h6" component="h1" gutterBottom>
          <b>Please fill in the details below to register</b>
        </Typography>
        
        {/* Display message */}
        {message && (
          <Alert severity={messageType === 'success' ? 'success' : 'error'}>
            {message}
          </Alert>
        )}

        {/* TextFields */}
        <TextField 
          id="username" 
          label="Username" 
          variant="outlined" 
          sx={{ width: '400px' }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField 
          id="email" 
          label="Email" 
          variant="outlined" 
          sx={{ width: '400px' }} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField 
          id="password" 
          label="Password" 
          variant="outlined" 
          type="password" 
          sx={{ width: '400px' }} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField 
          id="confirm-password" 
          label="Confirm Password" 
          variant="outlined" 
          type="password" 
          sx={{ width: '400px' }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Sign Up
        </Button>
        {/* Add login link */}
        <Typography variant="body1" sx={{ marginTop: '16px' }}>
          Already have an account?{' '}
          <Button onClick={handleLoginRedirect} variant="text" color="primary">
            Login
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
