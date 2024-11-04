import React, {useEffect} from 'react';
import { Container, Box, Typography, Button, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Vert pour la réussite
    },
  },
});

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Appeler l'API pour vider le panier de l'utilisateur
    const clearCart = async () => {
      try {
        await apiClient.post('api/api/cartItem/cart-items/clear'); // Assurez-vous que cette route pointe vers le bon endpoint backend
        console.log('Le panier a été vidé.');
      } catch (error) {
        console.error('Erreur lors de la suppression des articles du panier :', error);
      }
    };

    // Appeler la fonction lorsque la page de succès du paiement est chargée
    clearCart();
  }, []);

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
            onClick={() => navigate('/')}
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
