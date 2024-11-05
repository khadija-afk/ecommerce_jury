import nodemailer from 'nodemailer';
import { env } from '../config.js';
import { OrderDetails } from '../models/index.js';

// Fonction pour envoyer un e-mail de confirmation après l'achat
export const sendConfirmationEmail = async (user, order, paymentDetail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.user,
      pass: env.pass,
    },
  });

  // Créer le contenu de l'e-mail
  let articlesList = '';
  order.OrderItems.map(item => {
    articlesList += `
      <div>
        <p>Article: ${item.Article.name}</p>
        <p>Prix: ${item.Article.price}€</p>
        <img src="${item.Article.image}" alt="${item.Article.name}" style="width:100px;height:100px;" />
      </div>
    `;
  });

  const mailOptions = {
    from: env.user,
    to: user.email,
    subject: 'Confirmation de votre commande',
    html: `
      <h2>Merci pour votre achat, ${user.firstName} ${user.lastName}!</h2>
      <p>Votre commande a été reçue et est en cours de traitement.</p>
      <p><strong>Montant total : ${paymentDetail.amount}€</strong></p>
      <div>
        ${articlesList}
      </div>
      <p>Nous espérons vous revoir bientôt!</p>
    `,
  };

  // Envoyer l'e-mail
  await transporter.sendMail(mailOptions);
};
