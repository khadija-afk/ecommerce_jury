import React, { useEffect, useState } from 'react'; 
import { Container, Box, Typography, Button, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../utils/axiosConfig';
import { usePanier } from '../../utils/PanierContext';
import { useFavoris } from '../../utils/FavorieContext';

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

  const { setPanier, recalculateTotals } = usePanier(); // Extraction de recalculateTotals
  const { setFavorites } = useFavoris();

  useEffect(() => {
    
    const processOrderAndPayment = async () => {
      if (!orderId || !paymentDetailId || isRecorded) {
        console.log("Paramètres manquants ou enregistrement déjà effectué.");
        return;
      }
      
      try {
        console.log("Traitement des paiements et commandes...");
        await apiClient.put(`/api/payment/payment-details/${paymentDetailId}`, { status: 'Paid' });
        await apiClient.put(`/api/order/orders/${orderId}`, { status: 'Validé' });
        await apiClient.post('/api/cartItem/cart-items/clear');
        await apiClient.delete('/api/favorie/clear/api');

        setPanier([]);
        recalculateTotals([]);
        setFavorites([]);

        localStorage.removeItem('orderId');
        localStorage.removeItem('paymentDetailId');
        setIsRecorded(true);
      } catch (error) {
        console.error("Erreur :", error);
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
