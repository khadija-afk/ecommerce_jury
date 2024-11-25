import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

const TwoFactorAuth = () => {
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState(null);

  // Récupérer les informations utilisateur
  const fetchUserId = async () => {
    try {
      const response = await apiClient.get("/api/api/user/check_auth", {
        withCredentials: true,
      });
      setUserId(response.data.id); // ID utilisateur
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la récupération des informations utilisateur.",
      });
    }
  };

  // Générer le QR Code
  const fetchQrCode = async () => {
    try {
      const response = await apiClient.get("/api/api/A2F/generate", {
        withCredentials: true,
      });
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la génération du QR Code.",
      });
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) fetchQrCode();
  }, [userId]);

  // Activer l'A2F
  const handleActivate = async () => {
    try {
      const response = await apiClient.post(
        "/api/api/A2F/activate",
        { token: otp, secret, userId },
        { withCredentials: true }
      );
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Échec de l'activation de l'A2F.",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Activer l'authentification à deux facteurs
      </Typography>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}
      {qrCode && (
        <Box>
          <Typography>
            Scannez le QR Code avec une application d'authentification :
          </Typography>
          <img src={qrCode} alt="QR Code" style={{ maxWidth: "200px" }} />
        </Box>
      )}
      <TextField
        label="Code OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        sx={{ mt: 2, mb: 2 }}
        fullWidth
      />
      <Button variant="contained" onClick={handleActivate}>
        Activer l'A2F
      </Button>
    </Box>
  );
};

export default TwoFactorAuth;
