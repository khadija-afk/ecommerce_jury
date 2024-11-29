import React, { useState } from "react";
import apiClient from "../../utils/axiosConfig";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

interface Verify2FAProps {
  userId: number; // Déclarez userId comme une prop requise
  onSuccess: () => void;
}

const Verify2FA: React.FC<Verify2FAProps> = ({ userId, onSuccess }) => {
  const [otp, setOtp] = useState<string>(""); // OTP typé comme string
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleVerify = async () => {
    try {
      const response = await apiClient.post(
        "/api/api/A2F/verify",
        { userId, token: otp },
        { withCredentials: true }
      );
      setMessage({ type: "success", text: response.data.message });
      onSuccess(); // Appel de la fonction de succès
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Code incorrect.",
      });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Vérification A2F
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
      <Button
        variant="contained"
        onClick={handleVerify}
        disabled={!otp.trim()} // Désactiver le bouton si le champ OTP est vide
      >
        Vérifier
      </Button>
    </Box>
  );
};

export default Verify2FA;
