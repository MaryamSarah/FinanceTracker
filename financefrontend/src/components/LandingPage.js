import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, createTheme, ThemeProvider, Typography, Button, Tabs, Tab } from '@mui/material';
import PriceChangeIcon from '@mui/icons-material/PriceChange'; // Import PriceChangeIcon
import Money from './Money.png';
import Signup from './Signup.png';
import Join from './Join.png';

const imageUrl = 'https://media.licdn.com/dms/image/D4D12AQEsud-NQLNE4A/article-cover_image-shrink_720_1280/0/1680911074452?e=2147483647&v=beta&t=Jn-w3kEcU9lAbREYjD8Weij7ZV_tketEGp6Mehae_BY';

function DotTab(props) {
    return (
      <Tab
        {...props}
        disableRipple
        sx={{
          width: '12px', // Diameter of the dot
          height: '12px', // Diameter of the dot
          minWidth: 'auto',
          minHeight: 'auto',
          borderRadius: '50%', // Make tabs circular (dot shape)
          p: 0,
          m: 0,
          '&.Mui-selected': {
            backgroundColor: '#003366', // Dark blue color for selected dot
          },
          '&:not(.Mui-selected)': {
            backgroundColor: '#ccc', // Gray color for unselected dot
          },
        }}
      />
    );
  }
  

export default function LandingPage() {
  const [mode, setMode] = useState('light');
  const [currentTab, setCurrentTab] = useState(0); // State for the current tab

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const navigate = useNavigate(); // Step 1: Initialize navigate function

  const handleGetStartedClick = () => {
    navigate('/signup'); // Step 2: Redirect to the signup page
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTab(prevTab => (prevTab + 1) % 3); // Cycle through tabs 0, 1, 2
    }, 5000); // 5000 ms = 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Uncomment if you want to include the AppBar */}
        {/* <ResponsiveAppBar /> */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Stack vertically on small screens and horizontally on medium and up
            p: 0,
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
            color: mode === 'light' ? '#000' : '#fff',
            position: 'relative', // Position relative to allow pseudo-element positioning
            zIndex: 1,
          }}
        >
          {/* Content Box */}
          <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                textAlign: 'center',
                width: { xs: '100%', md: '50%' }, // Full width on small screens and half width on medium and up
                overflow: 'hidden', // Hide overflow text
                textOverflow: 'ellipsis', // Add ellipsis for overflow text
                wordBreak: 'break-word', // Break long words
                position: 'relative', // Position relative for the circle and square
                zIndex: 2, // Keep content above the circle and square
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  width: '250px', // Diameter of the circle
                  height: '250px', // Diameter of the circle
                  borderRadius: '50%', // Make it a circle
                  backgroundColor: 'rgba(0, 51, 102, 0.2)', // Dark blue with 50% transparency
                  top: '90px', // Move the circle closer to the top
                  left: '100px', // Move the circle closer to the left
                  zIndex: -1, // Place the circle behind the content
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '300px', // Width of the rounded square
                  height: '300px', // Height of the rounded square
                  borderRadius: '50%', // Rounded corners for the square
                  backgroundColor: 'rgba(0, 51, 102, 0.2)', // Dark blue with 50% transparency
                  bottom: '105px', // Move the square closer to the bottom
                  right: '70px', // Move the square closer to the right
                  zIndex: -1, // Place the square behind the content
                },
              }}
            >
            {/* Logo and Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', mt: 2 }}>
              {/* Logo */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, alignSelf: 'flex-start' }}>
                <PriceChangeIcon sx={{ fontSize: 40, mr: 1 }} /> {/* Adjust icon size and margin */}
                <Typography variant="h4" component="h1">
                  EzFinance
                </Typography>
              </Box>

              {/* Centered Content */}
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 4, mt: 16 }}>
                {currentTab === 0 && (
                  <Box>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                            EzFinance
                        </Typography>
                <Typography variant="body1" paragraph>
                  <Typography variant="body1" paragraph>
                    is your ultimate tool for effortless financial management.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    If you're looking to track your expenses, our website offers everything you need to do just that.
                  </Typography>
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                  <img src={Money} alt="Money" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }} />
                  </Box>
                  </Box>
                )}
                {currentTab === 1 && (
                    <Box>
                        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Welcome to EzFinance!
                        </Typography>
                        <Typography variant="body1" paragraph >
                        <Typography variant="body1" paragraph sx={{fontSize:'1rem'}}>
                            <b>Easy Setup:</b> Quickly set up your account and get started on transaction tracking.
                        </Typography>
                            <Typography variant="body1" paragraph sx={{ mt: 2 , fontSize:'1rem'}}>
                                The one-stop interface for anyone who wants to track their transactions, at your doorstep now!
                            </Typography>
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <img src={Join} alt="Join" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }} />
                            </Box>
                        </Box>
                )}

                {currentTab === 2 && (
                  <>
                <Typography variant="body1" paragraph>
                  <Typography variant="body1" paragraph sx={{fontSize:'1.5rem'}}>
                       Curious and want to learn more?               
                  </Typography>
                  <Typography variant="body1" paragraph >
                    Why wait when financial heaven is just one click away?
                  </Typography>
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                        <img src={Signup} alt="Signup" style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px' }} />
                  </Box>
                    {/* Button */}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        mt: 3, // Margin top
                        backgroundColor: '#003366', // Dark blue color
                        '&:hover': {
                          backgroundColor: '#002244', // Darker blue on hover
                        },
                        width: '200px', // Set a minimum width for the button
                        ml: 27
                      }}
                      onClick={handleGetStartedClick}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </Box>

              {/* Tab Navigation */}
              <Box sx={{ mt: 2 }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="Navigation Tabs"
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      justifyContent: 'center', // Center tabs horizontally
                      gap: 1, // Add spacing between dots
                      mb: -10,
                    },
                    '& .MuiTabs-indicator': {
                      display: 'none', // Hide the tab indicator line
                    },
                  }}
                >
                  <DotTab />
                  <DotTab />
                  <DotTab />
                </Tabs>
              </Box>
            </Box>
          </Box>

          {/* Image Box */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' }, // Full width
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: { xs: 'auto', md: '100vh' }, // Adjust height based on screen size
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
