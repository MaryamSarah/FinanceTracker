import React, { createContext, useContext, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a context for the theme
const ThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const location = useLocation(); // Get current location
  const [mode, setMode] = useState('light'); // Default mode

  // Define dark and light themes
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  // Determine if current path should use light or dark theme
  const currentTheme = location.pathname === '/login' || location.pathname === '/signup' 
    ? lightTheme
    : (mode === 'dark' ? darkTheme : lightTheme);

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const value = useMemo(() => ({ toggleTheme, mode }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={currentTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme context
export const useThemeContext = () => useContext(ThemeContext);
