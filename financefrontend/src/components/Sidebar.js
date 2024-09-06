import React, { useEffect } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Toolbar, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useLocation } from 'react-router-dom'; // Import useLocation for route-based logic
import { useTheme } from '@mui/material/styles'; // Import useTheme

const NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'transactions', title: 'Transactions', icon: <ReceiptIcon /> },
  { segment: 'categories', title: 'Categories', icon: <CategoryIcon /> },
];

function Sidebar({ onSelect, open }) {
  const [selectedSegment, setSelectedSegment] = React.useState("");
  const location = useLocation(); // Get current route location
  const theme = useTheme(); // Access the theme object

  useEffect(() => {
    // Update selectedSegment based on the current route
    const currentPath = location.pathname.split('/').pop();
    if (NAVIGATION.some(item => item.segment === currentPath)) {
      setSelectedSegment(currentPath);
    }
  }, [location.pathname]); // Update whenever location.pathname changes

  const handleSelect = (segment) => {
    if (segment !== selectedSegment) {  // Only update if the segment is different
      setSelectedSegment(segment);
      onSelect(segment); // Call the onSelect function to navigate
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 80,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.background.paper, // Use theme color
          color: theme.palette.text.primary, // Use theme color
          transition: 'width 0.3s',
          marginTop: "30px",
        },
      }}
    >
      <Box>
        <Toolbar />
        <List sx={{ mt: -1 }}>
          {NAVIGATION.map((item) => (
            <ListItem
              button
              key={item.segment}
              onClick={() => handleSelect(item.segment)}
              sx={{
                backgroundColor: selectedSegment === item.segment
                  ? theme.palette.action.selected // Use theme color
                  : 'inherit',
                boxShadow: selectedSegment === item.segment
                  ? `0px 4px 6px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`
                  : 'none',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover, // Use theme color
                  boxShadow: `0px 4px 6px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`, // Use theme color
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {item.icon}
              </ListItemIcon>
              <Collapse in={open} orientation="horizontal">
                <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
              </Collapse>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
