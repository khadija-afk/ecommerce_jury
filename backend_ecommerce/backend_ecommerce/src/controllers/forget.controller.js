import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import { User } from '../models/index.js';
import { env } from '../config.js';

// Fonction pour envoyer un e-mail de réinitialisation de mot de passe
const sendEmail = ({ recipient_email, OTP }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.user,
        pass: env.pass,
      },
    });

    const mailOptions = {
      from: env.user,
      to: recipient_email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Password Recovery</title>
        </head>
        <body>
          <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
              <div style="border-bottom:1px solid #eee">
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Votre Application</a>
              </div>
              <p style="font-size:1.1em">Bonjour,</p>
              <p>Vous avez demandé à réinitialiser votre mot de passe. Utilisez le lien ci-dessous pour définir un nouveau mot de passe. Ce lien est valable pendant 1 heure.</p>
              <a href="http://localhost:9090/api/forget/verify-token?token=${OTP}" style="background: #00466a;color: #fff;padding: 10px 20px;text-decoration: none;border-radius: 5px;">Réinitialiser le mot de passe</a>
              <p style="font-size:0.9em;">Cordialement,<br />L'équipe de Votre Application</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Votre Application</p>
                <p>Adresse</p>
                <p>France</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
        return reject({ message: 'Erreur lors de l\'envoi de l\'e-mail.' });
      }
      console.log('Email envoyé:', info.response);
      resolve({ message: 'Email envoyé avec succès.' });
    });
  });
};

// Contrôleur pour demander la réinitialisation du mot de passe
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Génération du token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure

    // Log avant la sauvegarde pour vérifier les valeurs
    console.log('Token généré :', resetToken);
    console.log('Date d\'expiration :', user.resetPasswordExpires);

    // Sauvegarde du token et de la date d'expiration
    try {
      await user.save({ fields: ['resetPasswordToken', 'resetPasswordExpires'] });
      console.log('Token de réinitialisation enregistré dans la BD :', resetToken);
      console.log('Tentative d\'enregistrement du token pour l\'utilisateur :', user.email);
    } catch (saveError) {
      console.error('Erreur lors de la sauvegarde du token :', saveError);
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du token.' });
    }

    // Envoi de l'email de réinitialisation
    await sendEmail({ recipient_email: email, OTP: resetToken });
    res.status(200).json({ message: 'Email de réinitialisation envoyé.' });

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation du mot de passe :', error);
    res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation du mot de passe.' });
  }
};

// Contrôleur pour vérifier la validité du token
export const verifyResetToken = async (req, res) => {
  const { token } = req.query; // ou `req.body` selon la manière dont le token est envoyé

  try {
    // Recherche de l'utilisateur par token et vérification de l'expiration
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date(), // Vérifie que la date actuelle est inférieure à la date d'expiration
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré.' });
    }

    // Token valide, autoriser l'utilisateur à changer de mot de passe
    res.status(200).json({ message: 'Token valide, vous pouvez réinitialiser votre mot de passe.' });

  } catch (error) {
    console.error('Erreur lors de la vérification du token :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la vérification du token.' });
  }
};

// Contrôleur pour réinitialiser le mot de passe
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: new Date() }, // Utilisation correcte de l'opérateur Op.gt
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré.' });
    }

    // Hacher le nouveau mot de passe et le sauvegarder
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null; // Réinitialiser le token
    user.resetPasswordExpires = null; // Réinitialiser la date d'expiration
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
};
