import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import recharts components
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import BasicTable from './BasicTable';
import IncomeExpenseCard from './IncomeExpenseCard';
import { useThemeContext } from './ThemeContext'; // Import your theme context

export default function Dashboard() {
  const { mode, toggleTheme } = useThemeContext(); // Use theme context
  const [pathname, setPathname] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabValue, setTabValue] = useState('1');
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0); // Initialize income state
  const [expenses, setExpenses] = useState(0); // Initialize expenses state
  const navigate = useNavigate();
  const theme = useTheme();

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

  const refreshTransactions = () => {
    // Fetch transactions data
    fetch('http://localhost:8080/transaction/getAll')
      .then((response) => response.json())
      .then((data) => {
        // Set transactions data
        setTransactions(data);

        // Initialize income and expenses
        let totalIncome = 0;
        let totalExpenses = 0;

        // Process each transaction to calculate totals
        data.forEach(transaction => {
          if (transaction.type === 'INCOME') {
            totalIncome += transaction.amount;
          } else if (transaction.type === 'EXPENSE') {
            totalExpenses += transaction.amount;
          }
        });

        // Update state with the computed totals
        setIncome(totalIncome);
        setExpenses(totalExpenses);
      })
      .catch((error) => console.error('Error fetching transactions:', error));
  };

  const pieData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ];

  const COLORS = ['#0088FE', '#FF8042']; // Colors for the pie chart segments

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

          {/* Income and Expenses Pie Chart */}
          <Box sx={{ display: 'flex', width: '100%', mb: 4, mt: -3 }}>
            <IncomeExpenseCard income={income} expenses={expenses} />
          </Box>

          <Box sx={{ display: 'flex', width: '100%', mb: 4, mt: -40, ml: -5, justifyContent: 'flex-end' }}>
            <ResponsiveContainer width="50%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ width: '100%', mb: 1, mt: -3 }}>
            <Typography variant="h5" component="div" sx={{ textAlign: 'left', ml: 3, mb: 1 }}>
              Recent transactions
            </Typography>
          </Box>

          <BasicTable transactions={transactions} onTransactionDeleted={refreshTransactions} sx={{ mt: 1 }} />
        </Box>
      </Box>
    </Box>
  );
}
