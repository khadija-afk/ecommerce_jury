import speakeasy from 'speakeasy';
import qrcode from 'qrcode'; // Assurez-vous que le nom ici est en minuscules
import {User} from '../models/index.js'; // Modèle utilisateur
import { verifyTOTP } from '../utils/totp.js';


// Générer la clé secrète et le QR code
export const generate2FASecret = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: 'MyAppName' });

    const otpauthUrl = secret.otpauth_url;
    const qrCodeDataURL = await qrcode.toDataURL(otpauthUrl); // Utilisez "qrcode" ici

    res.status(200).json({
      secret: secret.base32,
      otpauthUrl: otpauthUrl,
      qrCode: qrCodeDataURL,
    });
  } catch (error) {
    console.error('Erreur lors de la génération du secret 2FA:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la génération du 2FA.' });
  }
};

// Activer l'A2F

export const activate2FA = async (req, res) => {
  console.log('___activate2FA: Starting activation process');

  const { userId, token, secret } = req.body;

  try {
      const user = await User.findByPk(userId);
      if (!user) {
          return res.status(404).json({ error: 'Utilisateur introuvable.' });
      }

      // Vérification du code OTP
      const verificationResult = verifyTOTP(secret, token);

      if (!verificationResult.isValid) {
          console.error('___activate2FA:', verificationResult.error);
          return res.status(400).json({ error: verificationResult.error });
      }

      // Activer l'A2F dans la base de données
      await User.update(
          { is2FAEnabled: true, twoFASecret: secret },
          { where: { id: userId } }
      );

      console.log('___activate2FA: 2FA successfully activated');
      return res.status(200).json({ message: 'A2F activée avec succès.' });
  } catch (error) {
      console.error('___activate2FA: Error activating 2FA:', error);
      return res.status(500).json({ error: 'Erreur serveur lors de l’activation de l’A2F.' });
  }
};


// Vérifier le code lors de la connexion
export const verify2FA = async (req, res) => {
  const { userId, token } = req.body;

  const user = await User.findByPk(userId);

  const isVerified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: 'base32',
    token,
  });

  if (isVerified) {
    res.status(200).json({ message: 'Authentification réussie.' });
  } else {
    res.status(400).json({ error: 'Code incorrect.' });
  }
};

// Désactiver l'A2F
export const disable2FA = async (req, res) => {
  const { userId } = req.body;

  await User.update({ is2FAEnabled: false, twoFASecret: null }, { where: { id: userId } });
  res.status(200).json({ message: 'A2F désactivée avec succès.' });
};
