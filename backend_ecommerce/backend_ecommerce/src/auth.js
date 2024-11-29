import jwt from 'jsonwebtoken';
import { env } from './config.js';
import { createError } from './error.js';
import { User } from './models/index.js'; // Modèle utilisateur
import { verifyTOTP } from './utils/totp.js'; // Fonction pour vérifier l'OTP

export const verifieToken = async (req, res, next) => {
    const token = req.cookies.access_token;
  
    console.log("___verifieToken: Received token:", token);
  
    if (!token) {
      console.error("___verifieToken: No token provided");
      return next(createError(401, "Accès interdit, aucun token fourni"));
    }
  
    try {
      const user = jwt.verify(token, env.token);
  
      if (!user.id) {
        console.error("___verifieToken: Missing user ID in token");
        return next(createError(402, "ID utilisateur manquant dans le JWT"));
      }
  
      const dbUser = await User.findByPk(user.id);
  
      if (!dbUser) {
        console.error("___verifieToken: User not found in database");
        return next(createError(404, "Utilisateur introuvable"));
      }
  
      req.user = dbUser;
  
      const non2FARoutes = ['/api/A2F/generate', '/api/A2F/activate'];
      if (non2FARoutes.includes(req.path)) {
        console.log(`___verifieToken: Skipping 2FA for route ${req.path}`);
        return next();
      }
  
      if (dbUser.is2FAEnabled) {
        const otp = req.body.token || req.headers['x-2fa-code']; // Support pour les en-têtes et le corps
        if (!otp) {
          console.error("___verifieToken: 2FA code missing");
          return next(createError(401, "Code A2F requis"));
        }
  
        const isValid = verifyTOTP(dbUser.twoFASecret, otp);
        if (!isValid) {
          console.error("___verifieToken: Invalid OTP - Code:", otp, "Secret:", dbUser.twoFASecret);
          return next(createError(403, "Code A2F non valide"));
        }
  
        console.log("___verifieToken: 2FA code verified successfully");
      } else {
        console.log("___verifieToken: 2FA not enabled for user");
      }
  
      next();
    } catch (err) {
      console.error("___verifieToken: Token verification failed:", err.message);
      return next(createError(403, "Token non valide !"));
    }
  };
  