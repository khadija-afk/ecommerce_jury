import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate de react-router-dom
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';

const defaultTheme = createTheme();

const OTPVerificationForm: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialiser useNavigate pour la redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Supposons que '123456' soit l'OTP correct pour cet exemple
    const correctOTP = '123456';

    if (otp === correctOTP) {
      navigate('/reset-password'); // Rediriger vers la page de réinitialisation du mot de passe
    } else {
      setError('Le code OTP est incorrect. Veuillez réessayer.');
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
            Vérification du code OTP
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Code OTP"
              name="otp"
              autoComplete="off"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {error && <Typography variant="body2" color="error.main">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Vérifier
            </Button>
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

export default OTPVerificationForm;
