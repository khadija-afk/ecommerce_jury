import React from 'react';
import { Container, Box, Typography, Button, Avatar } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    error: {
      main: '#f44336', // Rouge pour l'échec
    },
  },
});

const PaymentFailedPage = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            bgcolor: '#fefefe',
            borderRadius: 3,
            p: 4,
            boxShadow: 3,
          }}
        >
          <Avatar sx={{ bgcolor: 'error.main', mb: 2 }}>
            <ErrorIcon sx={{ fontSize: 48, color: '#fff' }} />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            Paiement échoué
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Nous sommes désolés, votre paiement n'a pas pu être traité. Veuillez réessayer ou utiliser un autre moyen de paiement.
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate('/checkout')}
            sx={{ mt: 2 }}
          >
            Réessayer le paiement
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PaymentFailedPage;
