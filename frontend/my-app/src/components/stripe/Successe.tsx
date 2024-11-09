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
  const orderId = searchParams.get('orderId') || localStorage.getItem('orderId');
  const paymentDetailId = searchParams.get('paymentDetailId') || localStorage.getItem('paymentDetailId');
  const [isRecorded, setIsRecorded] = useState(false);

  useEffect(() => {
    const processOrderAndPayment = async () => {
      console.log("orderId:", orderId);
      console.log("paymentDetailId:", paymentDetailId);
      console.log("isRecorded:", isRecorded);

      if (!orderId || !paymentDetailId || isRecorded) {
        console.log("Paramètres manquants ou enregistrement déjà effectué.");
        return;
      }

      try {
        // Mettre à jour le statut de PaymentDetail à "Paid"
        await apiClient.put(`/api/api/payment/payment-details/${paymentDetailId}`, {
          status: 'Paid'
        });
        console.log("Statut du paiement mis à jour à 'Paid'.");

        // Mettre à jour le statut de la commande à "Validé"
        await apiClient.put(`/api/api/order/orders/${orderId}`, {
          status: 'Validé'
        });
        console.log("Statut de la commande mis à jour à 'Validé'.");

        // Vider le panier après la mise à jour des statuts
        await apiClient.post('/api/api/cartItem/cart-items/clear');
        console.log("Le panier a été vidé.");

        // Supprimer les valeurs du localStorage après traitement
        localStorage.removeItem('orderId');
        localStorage.removeItem('paymentDetailId');

        setIsRecorded(true); // Marquer l'enregistrement comme effectué
      } catch (error) {
        console.error("Erreur lors de la mise à jour du paiement, de la commande ou du panier :", error);
      }
    };

    processOrderAndPayment();
  }, [orderId, paymentDetailId, isRecorded]);

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
