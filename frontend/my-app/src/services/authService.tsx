import axios from 'axios';

const API_URL = ''; // Remplacez par l'URL de votre serveur backend

const sendRecoveryEmail = async (email: string): Promise<void> => {
  return axios.post(`${API_URL}api/api/forget/send_recovery_email`, {
    recipient_email: email,
    OTP: '123456',
  });
};

export default {
  sendRecoveryEmail,
};
