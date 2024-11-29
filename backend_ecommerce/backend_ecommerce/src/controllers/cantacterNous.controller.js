import { transporter } from '../configEmail.js';

// Contrôleur pour envoyer un email
export const sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    // Validation des champs
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    try {
        const mailOptions = {
            from: email, // Adresse de l'utilisateur
            to: process.env.EMAIL_RECIPIENT || 'khadijaa.kenzi@gmail.com', // Votre email
            subject: `Nouveau message de ${name}`,
            html: `
                <h2>Nouveau message de contact</h2>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Message :</strong> ${message}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Votre message a été envoyé avec succès !' });
    } catch (error) {
        console.error('Erreur lors de l’envoi du message de contact :', error);
        res.status(500).json({ error: 'Erreur serveur. Impossible d’envoyer le message.' });
    }
};
