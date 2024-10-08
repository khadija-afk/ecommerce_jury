import { Router } from 'express';
import nodemailer from 'nodemailer';

import { env } from '../config.js';

// Créez un routeur Express
const router = Router();

// Fonction pour envoyer des e-mails
const sendEmail = ({ recipient_email, OTP }) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.user ,
        pass: env.pass
      },
      
    });
    console.log('khadija motpasse', env.user, env.pass);


    const mailOptions = {
      from: env.user,
      to: recipient_email,
      subject: 'KODING 101 PASSWORD RECOVERY',
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
                <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Koding 101</a>
              </div>
              <p style="font-size:1.1em">Hi,</p>
              <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
              <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
              <hr style="border:none;border-top:1px solid #eee" />
              <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                <p>Bios Boly</p>
                <p>92000 Nanterre</p>
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
        console.log(error);
        return reject({ message: 'An error occurred while sending email.' });
      }
      return resolve({ message: 'Email sent successfully.' });
    });
  });
};

// Route pour l'envoi de l'e-mail de réinitialisation de mot de passe
router.post('/send_recovery_email', (req, res) => {
  const { recipient_email, OTP } = req.body;
  sendEmail({ recipient_email, OTP })
    .then(response => res.send(response.message))
    .catch(error => res.status(500).send(error.message));
});

export default router;
