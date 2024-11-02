import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { registerUser, UserData } from './userSlice';
import { Button, TextField, Typography, Grid, Box, Container, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Hook pour la redirection
  const userStatus = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);

  const [formData, setFormData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user' // Ajout du champ rôle si nécessaire
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (userStatus === 'succeeded') {
      // Ne pas rediriger automatiquement
      // navigate('/sign'); // Si vous souhaitez rediriger automatiquement, décommentez cette ligne
    }
  }, [userStatus, navigate]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Inscription
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Prénom"
                  autoFocus
                  onChange={handleChange}
                  value={formData.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nom"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleChange}
                  value={formData.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  value={formData.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="role"
                  label="Rôle"
                  id="role"
                  onChange={handleChange}
                  value={formData.role}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              S'inscrire
            </Button>
          </Box>
          {userStatus === 'loading' && <Typography variant="body2" color="text.secondary">Chargement...</Typography>}
          {userStatus === 'succeeded' && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="success.main">Votre compte a été créé avec succès !</Typography>
              <Link href="/sign" variant="body2" sx={{ display: 'block', mt: 1 }}>
                Cliquez ici pour vous connecter
              </Link>
            </Box>
          )}
          {userStatus === 'failed' && <Typography variant="body2" color="error.main">{error}</Typography>}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterForm;
