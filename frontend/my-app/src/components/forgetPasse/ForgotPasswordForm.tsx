import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate
import authService from '../../services/authService'; // Import du service d'authentification

const defaultTheme = createTheme();

const PasswordResetForm: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate(); // Initialisation de useNavigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.sendRecoveryEmail(email);
      setMessage('Un e-mail de réinitialisation a été envoyé.');
      setError('');

      // Rediriger l'utilisateur vers la page de vérification du code OTP après l'envoi de l'email
      navigate('/verify-otp'); // Assurez-vous que la route /verify-otp est configurée
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'e-mail de réinitialisation');
      setMessage('');
    }
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
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Réinitialiser le mot de passe
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse e-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Envoyer le lien de réinitialisation
            </Button>
            {message && <Typography variant="body2" color="success.main">{message}</Typography>}
            {error && <Typography variant="body2" color="error.main">{error}</Typography>}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign" variant="body2">
                  Retour à la connexion
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box sx={{ mt: 8, mb: 4 }} component="footer">
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
              Votre Site Web
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PasswordResetForm;
