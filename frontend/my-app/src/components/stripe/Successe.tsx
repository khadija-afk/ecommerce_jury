import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
  },
});

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const order_fk = searchParams.get('order_fk');
  const amount = searchParams.get('amount');
  const [isRecorded, setIsRecorded] = useState(false); // Indicateur pour éviter les doublons

  useEffect(() => {
    const recordPaymentDetails = async () => {
      if (!order_fk || !amount) {
        console.error("Erreur: order_fk ou amount est manquant.");
        return;
      }

      try {
        const paymentDetails = {
          order_fk,
          amount,
          provider: "Stripe",
          status: "success",
        };

        // Enregistrer les détails du paiement s'il n'a pas été fait
        if (!isRecorded) {
          const response = await apiClient.post('/api/api/payment/payment-details', paymentDetails);
          console.log("Détails de paiement enregistrés :", response.data);
          setIsRecorded(true); // Marque comme enregistré

          // Vider le panier de l'utilisateur après enregistrement du paiement
          await apiClient.post('/api/api/cartItem/cart-items/clear');
          console.log("Le panier a été vidé.");
        }

      } catch (error) {
        console.error("Erreur lors de l'enregistrement des détails de paiement ou de la suppression du panier :", error);
      }
    };

    recordPaymentDetails();
  }, [order_fk, amount, isRecorded]);

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
