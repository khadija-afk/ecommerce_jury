import nodemailer from 'nodemailer';
import { env } from './config.js'; // Configurez vos variables d'environnement dans ce fichier

// Configurez le transporteur Nodemailer
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.user,
        pass: env.pass,
    },
});
