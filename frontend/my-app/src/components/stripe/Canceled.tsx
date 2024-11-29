import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Avatar } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';

const theme = createTheme({
  palette: {
    error: {
      main: '#f44336',
    },
  },
});

const PaymentFailedPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || localStorage.getItem('orderId');
  const paymentDetailId = searchParams.get('paymentDetailId') || localStorage.getItem('paymentDetailId');
  const [isRecorded, setIsRecorded] = useState(false);

  useEffect(() => {
    const processFailedPayment = async () => {
      console.log("orderId:", orderId);
      console.log("paymentDetailId:", paymentDetailId);
      console.log("isRecorded:", isRecorded);

      if (!orderId || !paymentDetailId || isRecorded) {
        console.log("Paramètres manquants ou enregistrement déjà effectué.");
        return;
      }

      try {
        // Mettre à jour le statut de PaymentDetail à "Failed"
        await apiClient.put(`/api/api/payment/payment-details/${paymentDetailId}`, {
          status: 'Failed'
        });
        console.log("Statut du paiement mis à jour à 'Failed'.");

        // Supprimer les valeurs du localStorage après traitement
        localStorage.removeItem('orderId');
        localStorage.removeItem('paymentDetailId');

        setIsRecorded(true); // Marquer l'enregistrement comme effectué
      } catch (error) {
        console.error("Erreur lors de la mise à jour du paiement :", error);
      }
    };

    processFailedPayment();
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
