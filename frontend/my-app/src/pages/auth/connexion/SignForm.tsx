import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { signInUser } from './authSlice';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Définir un thème par défaut
const defaultTheme = createTheme();

const SignInForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const authStatus = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);
    const navigate = useNavigate();

    const [credentials, setCredentials] = React.useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(signInUser(credentials));
    };

    React.useEffect(() => {
        if (authStatus === 'succeeded') {
            navigate('/'); // Rediriger vers la page d'accueil
        }
    }, [authStatus, navigate]);

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
                        Connexion
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
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#311C52', // Couleur du cadre par défaut
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#311C52', // Couleur au survol
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#311C52', // Couleur lorsqu'en focus
                                        },
                                    },
                                }}
                            />

                           <TextField
                                margin="normal"
                                required
                                fullWidth
                                 name="password"
                                label="Mot de passe"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#311C52', // Couleur du cadre par défaut
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#311C52', // Couleur au survol
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#311C52', // Couleur lorsqu'en focus
                                        },
                                    },
                                }}
                            />

                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Se souvenir de moi"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: '#311C52',  // Applique la couleur #311C52
                                ':hover': {
                                    backgroundColor: '#251040'  // Optionnel : couleur plus foncée au survol
                                }
                            }}
                        >
                            Se connecter
                        </Button>

                    <Grid container>
                        <Grid item xs>
                            <Link href="/forgot-password" variant="body2" sx={{ color: 'rgba(49, 28, 82, 0.5)' }}>
                                Mot de passe oublié ?
                            </Link>
                        </Grid>
                    <Grid item>
                        <Link href="register" variant="body2" sx={{ color: 'rgba(49, 28, 82, 0.5)' }}>
                            {"Vous n'avez pas de compte ? Inscrivez-vous"}
                        </Link>
                    </Grid>
                </Grid>
                    </Box>
                    {authStatus === 'loading' && <Typography variant="body2" color="text.secondary">Chargement...</Typography>}
                    {authStatus === 'succeeded' && <Typography variant="body2" color="success.main">Connexion réussie !</Typography>}
                    {authStatus === 'failed' && error && <Typography variant="body2" color="error.main">{error}</Typography>}
                </Box>
                <Box sx={{ mt: 8, mb: 4 }} component="footer">
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <Link color="inherit" href="https://mui.com/">
                            Votre site
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default SignInForm;
