import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem, Select, InputLabel, FormControl, Menu } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import BasicTable from './BasicTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTheme } from '@mui/material/styles'; // Correct import for useTheme
import { useThemeContext } from './ThemeContext'; // Correct import for useThemeContext
import { ThemeProvider } from '@emotion/react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function TransactionHistory() {
  const { mode, toggleTheme } = useThemeContext(); // Using theme context
  const theme = useTheme(); // Get the theme from MUI's useTheme
  const [pathname, setPathname] = useState('transactions');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabValue, setTabValue] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);


  const handleSidebarToggle = () => {
    setSidebarOpen(prevOpen => !prevOpen);
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

  const fetchTransactions = (queryParams = '') => {
    const url = queryParams ? `http://localhost:8080/transaction/history?${queryParams}` : `http://localhost:8080/transaction/history`;
    fetch(url)
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const refreshTransactions = () => {
    const queryParams = new URLSearchParams();

    // Add parameters to the query only if they have values
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (type) queryParams.append('type', type);
    if (category) queryParams.append('category', category);

    // Convert queryParams to string
    const queryString = queryParams.toString();

    // Fetch filtered transactions
    fetchTransactions(queryString);
  };

  const fetchCategories = () => {
    fetch('http://localhost:8080/category/getAll')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
    setDownloadMenuOpen(true);
  };
  
  const handleCloseMenu = () => {
    setDownloadMenuOpen(false);
  };
  
  
  const downloadAsExcel = () => {
    // Example: using xlsx library
    import('xlsx').then(xlsx => {
      const wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(transactions);
      xlsx.utils.book_append_sheet(wb, ws, 'Transactions');
      xlsx.writeFile(wb, 'transactions.xlsx');
    });
  };
  
  const downloadAsPdf = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
  
      // Define columns and data
      const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Category', dataKey: 'category' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Date', dataKey: 'date' },
      ];
  
      const data = transactions.map(transaction => ({
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.categoryName,
        type: transaction.type,
        date: transaction.transactionDate,
      }));
  
      // Add a title or any additional information if needed
      doc.text('Transaction History', 14, 16);
  
      // Use the autoTable plugin to add a table
      doc.autoTable({
        columns: columns,
        body: data,
        startY: 30  // Adjust if needed to start below the title
      });
  
      // Save the PDF
      doc.save('transactions.pdf');
    });
  };

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();

    // Fetch all transactions initially
    fetchTransactions();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Appbar onSidebarToggle={handleSidebarToggle} mode={mode} toggleTheme={toggleTheme} />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', flexGrow: 1, marginTop: 0, zIndex: 900, width: "100%", height: "100%", position: "fixed", padding: 0, overflow: "scroll" }}>
          <Sidebar
            onSelect={handleSelect}
            mode={mode}
            open={sidebarOpen}
            toggleTheme={toggleTheme}
          />
          <Box
            sx={{
              flexGrow: 1,
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
              color: mode === 'light' ? '#000' : '#fff',
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
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2, mt: -5 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <TextField
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ width: '45%', height: '40px', '& .MuiInputBase-input': { height: '100%' }, '& .MuiInputBase-input': { padding: '25px 12px', fontSize: '0.875rem', boxSizing: 'border-box' } }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ width: '45%', height: '40px', '& .MuiInputBase-input': { height: '100%' }, '& .MuiInputBase-input': { padding: '25px 12px', fontSize: '0.875rem', boxSizing: 'border-box' } }}
                />
                <FormControl sx={{ width: '45%', mt:0.5 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    label="Type"
                    sx={{ height: '45px', '& .MuiInputBase-input': { padding: '25px 12px', textAlign:'left' } }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="INCOME">Income</MenuItem>
                    <MenuItem value="EXPENSE">Expense</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ width: '45%' , mt:0.5}}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                    sx={{ height: '45px', '& .MuiInputBase-input': { padding: '25px 12px', textAlign:'left' } }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={refreshTransactions}
                sx={{ width: 'fit-content', mt: 1, mb: 2 }}
              >
                Apply Filters
              </Button>
              <Button
  variant="contained"
  color="primary"
  onClick={handleDownloadClick}
  sx={{ width: 'fit-content', mt: -6.5, ml:20, backgroundColor:'grey'}}
>
  Download report
</Button>

<Menu
  anchorEl={anchorEl}
  open={downloadMenuOpen}
  onClose={handleCloseMenu}
  MenuListProps={{ 'aria-labelledby': 'basic-button' }}
>
  <MenuItem onClick={() => { downloadAsExcel(); handleCloseMenu(); }}>Download as Excel</MenuItem>
  <MenuItem onClick={() => { downloadAsPdf(); handleCloseMenu(); }}>Download as PDF</MenuItem>
</Menu>

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
                Transaction History
              </Typography>
            </Box>
            <BasicTable transactions={transactions} onTransactionDeleted={refreshTransactions} sx={{ mt: 1 }} />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
