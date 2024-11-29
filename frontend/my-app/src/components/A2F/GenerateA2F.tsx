import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

interface Message {
  type: "success" | "error"; // Types possibles pour le message
  text: string;
}

const TwoFactorAuth = () => {
  const [qrCode, setQrCode] = useState<string | null>(null); // QR Code comme chaîne de caractères ou null
  const [secret, setSecret] = useState<string | null>(null); // Secret comme chaîne de caractères ou null
  const [otp, setOtp] = useState<string>(""); // Code OTP comme chaîne
  const [message, setMessage] = useState<Message | null>(null); // Message typé ou null
  const [userId, setUserId] = useState<number | null>(null); // ID utilisateur comme nombre ou null

  // Récupérer les informations utilisateur
  const fetchUserId = async () => {
    try {
      const response = await apiClient.get("/api/api/user/check_auth", {
        withCredentials: true,
      });
      setUserId(response.data.id); // ID utilisateur
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
