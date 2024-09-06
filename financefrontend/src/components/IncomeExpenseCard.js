import * as React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

export default function IncomeExpenseCard({ income, expenses }) {
  const theme = useTheme(); // Access the theme

  // Determine the background color and text color based on the theme mode
  const cardBackgroundColor = theme.palette.mode === 'dark' ? '#333' : theme.palette.background.paper;
  const textColor = theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary;

  return (
    <Card sx={{ minWidth: 275, mb: 3, backgroundColor: cardBackgroundColor }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ color: textColor }}>
          Financial Summary
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Income:
          </Typography>
          <Typography variant="body1" color={textColor}>
            ${income}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Expenses:
          </Typography>
          <Typography variant="body1" color={textColor}>
            ${expenses}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
