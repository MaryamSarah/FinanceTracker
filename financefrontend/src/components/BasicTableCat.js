import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from 'react-router-dom';

function BasicTableCat({ categories = [], onCategoryDeleted }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false); // State for conflict dialog
  const [conflictMessage, setConflictMessage] = useState(''); // Message to show in conflict dialog
  const [editErrorDialogOpen, setEditErrorDialogOpen] = useState(false); // State for edit error dialog
  const [editErrorMessage, setEditErrorMessage] = useState(''); // Message to show in edit error dialog

  const handleEdit = (id) => {
    navigate(`/category/update/${id}`); // Navigate to the edit page where the form will handle the PUT request
  };
  

  const handleDelete = (id) => {
    fetch(`http://localhost:8080/category/delete/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          onCategoryDeleted(); // Call the callback to refresh categories list
          setOpen(false);
        } else if (response.status === 409) { // Handle 409 Conflict error
          setConflictMessage('Cannot delete category as it has associated transactions.');
          setConflictDialogOpen(true);
          setOpen(false);
        } else {
          throw new Error('Failed to delete category');
        }
      })
      .catch(error => {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
        setOpen(false);
      });
  };

  const handleClickOpen = (id) => {
    setCategoryToDelete(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete !== null) {
      handleDelete(categoryToDelete);
    }
  };

  const handleConflictDialogClose = () => {
    setConflictDialogOpen(false); // Close the conflict dialog
  };

  const handleEditErrorDialogClose = () => {
    setEditErrorDialogOpen(false); // Close the edit error dialog
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>Id</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{category.id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{category.name}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{category.type}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton 
                      aria-label="edit" 
                      sx={{ color: 'grey' }} 
                      onClick={() => handleEdit(category.id)}
                    >
                      <ModeEditIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="delete" 
                      sx={{ color: 'grey' }} 
                      onClick={() => handleClickOpen(category.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No categories available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm Deletion Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category?
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

      {/* Conflict Dialog */}
      <Dialog open={conflictDialogOpen} onClose={handleConflictDialogClose}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Delete Error</DialogTitle>
        <DialogContent>
          {conflictMessage}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConflictDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Error Dialog */}
      <Dialog open={editErrorDialogOpen} onClose={handleEditErrorDialogClose}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Edit Error</DialogTitle>
        <DialogContent>
          {editErrorMessage}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditErrorDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BasicTableCat;
