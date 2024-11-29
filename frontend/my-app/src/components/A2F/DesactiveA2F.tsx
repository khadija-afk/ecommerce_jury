import React, { useState, useEffect } from "react";
import apiClient from "../../utils/axiosConfig";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

const Disable2FA = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(null);
  const [userId, setUserId] = useState(null);

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

  useEffect(() => {
    fetchUserId();
  }, []);

  const handleDisable = async () => {
    try {
      const response = await apiClient.post(
        "/api/api/A2F/disable",
        { userId, token: otp },
        { withCredentials: true }
      );
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "Échec de la désactivation de l'authentification à deux facteurs.",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Désactiver l'authentification à deux facteurs
      </Typography>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}
      <TextField
        label="Code OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        sx={{ mb: 2 }}
        fullWidth
      />
      <Button variant="contained" onClick={handleDisable}>
        Désactiver l'A2F
      </Button>
    </Box>
  );
};

export default Disable2FA;
