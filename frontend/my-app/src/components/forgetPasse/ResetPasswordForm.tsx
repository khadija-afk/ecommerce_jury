import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1); // Step 1: Request email, Step 2: Enter OTP, Step 3: New password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/api/send_recovery_email', { email });
      setMessage('Un e-mail de réinitialisation a été envoyé.');
      setError('');
      setStep(2); // Passer à l'étape suivante pour entrer l'OTP
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'e-mail de réinitialisation');
      setMessage('');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    // Validation de l'OTP avec le backend
    if (otp === '123456') { // Remplacez cette condition par une validation réelle de l'OTP
      setStep(3); // Passer à l'étape suivante pour entrer le nouveau mot de passe
    } else {
      setError('Code OTP invalide');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`'http://localhost:9090/api/user/update/ByEmail/${email}`, { email, password: newPassword });
      setMessage('Mot de passe réinitialisé avec succès.');
      setError('');
      navigate('/sign'); // Rediriger vers la page de connexion après succès
    } catch (err) {
      setError('Erreur lors de la réinitialisation du mot de passe');
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
            {step === 1 && 'Réinitialisation du mot de passe'}
            {step === 2 && 'Vérification du code OTP'}
            {step === 3 && 'Entrez le nouveau mot de passe'}
          </Typography>
          <Box component="form" onSubmit={step === 1 ? handleEmailSubmit : step === 2 ? handleOtpSubmit : handlePasswordSubmit} noValidate sx={{ mt: 1 }}>
            {step === 1 && (
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
            )}
            {step === 2 && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Code OTP"
                name="otp"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}
            {step === 3 && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="Nouveau mot de passe"
                name="newPassword"
                type="password"
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {step === 1 && 'Envoyer l\'e-mail de réinitialisation'}
              {step === 2 && 'Vérifier le code OTP'}
              {step === 3 && 'Réinitialiser le mot de passe'}
            </Button>
            {message && <Typography variant="body2" color="success.main">{message}</Typography>}
            {error && <Typography variant="body2" color="error.main">{error}</Typography>}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ResetPasswordPage;
