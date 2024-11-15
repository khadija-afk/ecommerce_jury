import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { registerUser, UserData } from './userSlice';
import { Button, TextField, Typography, Grid, Box, Container, Link, Alert, IconButton, InputAdornment } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userStatus = useSelector((state: RootState) => state.user.status);
  const error = useSelector((state: RootState) => state.user.error);

  const [formData, setFormData] = useState<UserData & { confirmPassword: string }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<UserData> & { confirmPassword?: string; general?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: '' // Efface l'erreur lorsqu'on commence à taper
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({}); // Réinitialise les erreurs

    // Vérifications de validation
    const errors: Partial<UserData> & { confirmPassword?: string } = {};
    if (!validateEmail(formData.email)) {
      errors.email = "Adresse e-mail invalide";
    }
    if (!validatePassword(formData.password)) {
      errors.password = "Le mot de passe doit comporter au moins 8 caractères, une majuscule, un caractère spécial et un chiffre.";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap();
    } catch (error: any) {
      console.log('Erreur capturée :', error);

      if (error.response && error.response.data && error.response.data.error) {
        setFieldErrors({ general: error.response.data.error });
      } else if (error.message) {
        setFieldErrors({ general: error.message });
      } else {
        setFieldErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
      }
    }
  };

  useEffect(() => {
    if (userStatus === 'succeeded') {
      navigate('/sign');
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
                  error={!!fieldErrors.firstName}
                  helperText={fieldErrors.firstName}
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
                  error={!!fieldErrors.lastName}
                  helperText={fieldErrors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Adresse e-mail"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={formData.email}
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                  value={formData.password}
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  error={!!fieldErrors.confirmPassword}
                  helperText={fieldErrors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              S'inscrire
            </Button>
          </Box>
          {fieldErrors.general && (
            <Alert severity="error" sx={{ mt: 2 }}>{fieldErrors.general}</Alert>
          )}
          {userStatus === 'loading' && <Typography variant="body2" color="text.secondary">Chargement...</Typography>}
          {userStatus === 'succeeded' && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="success.main">Votre compte a été créé avec succès !</Typography>
              <Link href="/sign" variant="body2" sx={{ display: 'block', mt: 1 }}>
                Cliquez ici pour vous connecter
              </Link>
            </Box>
          )}
          {userStatus === 'failed' && error && (
            <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterForm;
