import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Appbar({ mode, toggleTheme, onSidebarToggle }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
      handleClose(); // Close the menu
      navigate('/login'); // Redirect to the login page
    };

    const handleTitleClick = () => {
      navigate('/'); // Redirect to the landing page
    };
  
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="fixed"
          sx={{ backgroundColor: 'light blue' }} // Light blue color
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ ml: 1, mr: 5 }}
              onClick={onSidebarToggle} // Toggle sidebar on menu icon click
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ flexGrow: 1, cursor: 'pointer' }} // Add cursor pointer for clickable text
              onClick={handleTitleClick} // Redirect to landing page on click
            >
              EzFinance
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="toggle theme"
                onClick={toggleTheme}
                color="inherit"
                sx={{ mr: 2 }}
              >
                {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem> {/* Use handleLogout for redirection */}
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
    );
}

export default Appbar;
