import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from 'react-router-dom';

function BasicTable({ transactions = [], onTransactionDeleted }) { // Added onTransactionDeleted prop
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const handleEdit = (id) => {
    const currentPath = window.location.pathname;
    navigate(`/transaction/update/${id}?source=${currentPath}`);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/transaction/delete/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          onTransactionDeleted(); // Call the callback to refresh transactions list
          setOpen(false);
        } else {
          throw new Error('Failed to delete transaction');
        }
      })
      .catch(error => {
        console.error('Error deleting transaction:', error);
        alert('Error deleting transaction');
        setOpen(false);
      });
  };

  const handleClickOpen = (id) => {
    setTransactionToDelete(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete !== null) {
      handleDelete(transactionToDelete);
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>{transaction.categoryName}</TableCell>
                  <TableCell>{transaction.transactionDate}</TableCell>
                  <TableCell>
                    <IconButton 
                      aria-label="edit" 
                      sx={{ color: 'grey' }} 
                      onClick={() => handleEdit(transaction.id)}
                    >
                      <ModeEditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="delete" 
                      sx={{ color: 'grey' }} 
                      onClick={() => handleClickOpen(transaction.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No transactions available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this transaction?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BasicTable;
