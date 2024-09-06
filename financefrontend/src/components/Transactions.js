import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, useTheme, Tabs, Tab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import BasicTable from './BasicTable';
import { useThemeContext } from './ThemeContext'; // Import your theme context

export default function Transactions() {
  const { mode, toggleTheme } = useThemeContext(); // Use theme context
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabValue, setTabValue] = useState('2');
  const [transactions, setTransactions] = useState([]);
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
    navigate(`/${segment}`);
  };

  const handleAddTransaction = () => {
    navigate('/transaction/add');
  };

  const handleTransactionHistory = () => {
    navigate('/transaction/history');
  };

  const refreshTransactions = () => {
    fetch('http://localhost:8080/transaction/getAll')
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    refreshTransactions(); // Initial fetch
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
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
          backgroundColor: theme.palette.background.default, // Use theme background color
        }}
      >
        <Sidebar
          onSelect={handleSelect}
          mode={mode}
          open={sidebarOpen}
          toggleTheme={theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.secondary.main}
        />
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.background.paper, // Use theme background color
            color: theme.palette.text.primary, // Use theme text color
            marginTop: 0,
          }}
        >
          <Box sx={{ width: '100%', mb: 8, mt: 12 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="transaction tabs">
              <Tab label="Dashboard" value="1" />
              <Tab label="Transactions" value="2" />
              <Tab label="Categories" value="3" />
            </Tabs>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, mt: -3, width: '100%' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTransaction}
              sx={{ mb: 2, width: '100%' }}
            >
              Add New Transaction
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleTransactionHistory}
              sx={{ width: '100%' }}
            >
              Transaction History
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
              Transactions
            </Typography>
          </Box>
          <BasicTable transactions={transactions} onTransactionDeleted={refreshTransactions} sx={{ mt: 1 }} />
        </Box>
      </Box>
    </Box>
  );
}
