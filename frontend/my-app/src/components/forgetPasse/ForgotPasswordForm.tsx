import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Modal from "@mui/material/Modal";
import apiClient from "../../utils/axiosConfig";

const defaultTheme = createTheme();

const PasswordResetForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await apiClient.post("/api/forget/request-reset", { email });
      setMessage("Un e-mail de réinitialisation a été envoyé.");
      setError("");
      setOpenModal(true);
    } catch (err: any) {
      if (err.response?.data?.error) {
        // Utiliser le message d'erreur renvoyé par le backend
        setError(err.response.data.error);
      } else {
        setError("Erreur lors de l'envoi de l'e-mail de réinitialisation.");
      }
      setMessage("");
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Réinitialiser le mot de passe
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
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
              error={!!error}
              helperText={error || ""}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Envoyer le lien de réinitialisation
            </Button>
            {message && (
              <Typography variant="body2" color="success.main">
                {message}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Modal de confirmation */}
        <Modal open={openModal} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              E-mail envoyé
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Un e-mail de réinitialisation a été envoyé à votre adresse. Veuillez
              vérifier votre boîte de réception.
            </Typography>
            <Button
              onClick={handleClose}
              sx={{ mt: 2 }}
              variant="contained"
            >
              OK
            </Button>
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
};

export default PasswordResetForm;
