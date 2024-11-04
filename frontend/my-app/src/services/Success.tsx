import React from 'react';
import { Container, Box, Typography, Button, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Vert pour la réussite
    },
  },
});

const PaymentSuccessPage = () => {
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
            bgcolor: '#f9f9f9',
            borderRadius: 3,
            p: 4,
            boxShadow: 3,
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: '#fff' }} />
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>
            Paiement réussi !
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Merci pour votre achat. Votre commande a été traitée avec succès. Vous recevrez bientôt un e-mail de confirmation avec les détails de votre commande.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/home')}
            sx={{ mt: 2 }}
          >
            Continuer vos achats
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PaymentSuccessPage;
