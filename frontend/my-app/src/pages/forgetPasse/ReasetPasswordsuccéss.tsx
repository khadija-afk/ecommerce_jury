import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const ResetPasswordSuccess = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/sign'); // Redirige vers la page de connexion
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
            <CheckCircleOutlineIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Réinitialisation du mot de passe réussie !
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={handleRedirect}
            sx={{ mt: 3, mb: 2 }}
          >
            Retour à la connexion
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ResetPasswordSuccess;
