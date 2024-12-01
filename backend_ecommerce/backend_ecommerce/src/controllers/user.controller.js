import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Cart } from "../models/index.js";
import { env } from "../config.js";

import * as Service from "../services/service.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe sont requis." });
  }

  let user;

  // Étape 1 : Recherche de l'utilisateur
  try {
    user = await User.findOne({ where: { email } });
  } catch (err) {
    console.error("Erreur lors de la recherche de l'utilisateur :", err);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }

  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable." });
  }

  // Étape 2 : Validation du mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      error: "Identifiants incorrects.",
      details: "Le mot de passe est invalide.",
    });
  }

  // Étape 3 : Génération du token JWT
  const token = jwt.sign({ id: user.id, role: user.role }, env.token, {
    expiresIn: "24h", // Le token est valide pendant 24 heures
  });

  console.log("Token généré :", token);

  // Suppression du mot de passe des données utilisateur avant de les retourner
  const { password: _, ...otherData } = user.dataValues;

  // Étape 4 : Envoi de la réponse avec le cookie
  console.log("Cookie configuré pour l'envoi :", {
  token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
});
res.cookie("access_token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // Actif uniquement en HTTPS
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // "strict" en prod, "lax" en dev
})

  

    
    .status(200)
    .json({
      message: "Connexion réussie.",
      user: otherData,
    });

    console.log("Cookie envoyé : ", res.cookie.access_token);

};
// Fonction pour vérifier le format de l'email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction pour vérifier la complexité du mot de passe
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passwordRegex.test(password);
};

// Configuration du transporteur Nodemailer (réutilisation de la configuration existante)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.user, 
    pass: env.pass
  },
});

const sendWelcomeEmail = (recipient_email, firstName, lastName) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: env.user,
      to: recipient_email,
      subject: 'Bienvenue chez E-Commerce khadija !',
html: `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Bienvenue sur E-Commerce khadija</title>
  </head>
  <body>
    <div style="font-family: Helvetica, Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <header style="background-color: #4CAF50; padding: 15px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">E-Commerce khadija</h1>
        </header>
        <section style="padding: 20px;">
          <p style="font-size: 16px; color: #333;">Bonjour ${firstName} ${lastName},</p>
          <p style="font-size: 16px; color: #333;">Nous sommes heureux de vous accueillir parmi nos nouveaux utilisateurs ! Votre compte a été créé avec succès.</p>
          <p style="font-size: 16px; color: #333;">Découvrez dès maintenant notre large gamme de produits et profitez de nos offres exclusives.</p>
          <p style="font-size: 16px; color: #333;">Si vous avez la moindre question, n'hésitez pas à nous contacter. Nous sommes là pour vous aider !</p>
        </section>
        <footer style="background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 14px; color: #555;">
          <p>Cordialement,</p>
          <p>L'équipe E-Commerce khadija</p>
          <p style="margin: 0;">E-Commerce khadija, 92000 Nanterre, France</p>
        </footer>
      </div>
    </div>
  </body>
  </html>
`,
    };

     // Ajoutez un console.log ici pour voir les détails avant l'envoi
     console.log('Détails de l\'e-mail :', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      content: mailOptions.html,
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return reject({ message: 'Une erreur est survenue lors de l\'envoi de l\'email.' });
      }
      console.log('Email envoyé:', info.response);
      resolve({ message: 'Email envoyé avec succès.' });
    });
  });
};

// Fonction d'enregistrement de l'utilisateur
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Vérification du format de l'email
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "L'email n'est pas valide. Veuillez entrer un email correct." });
    }

    // Vérification de la complexité du mot de passe
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: "Le mot de passe doit comporter au moins 8 caractères, une majuscule, un caractère spécial et un chiffre." });
    }

    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }

    // Hachage du mot de passe
    req.body['password'] = await bcrypt.hash(password, 10);
    const user = await Service.create(User, req.body);

    // Création d'un panier pour l'utilisateur
    const body_cart = {
      user_fk: user.id,
      total_amount: 0,
    };
    const cart = await Service.create(Cart, body_cart);

    // Envoi de l'email de bienvenue
    await sendWelcomeEmail(email, firstName, lastName);

    res.status(201).json({
      user,
      cart,
      message: 'Utilisateur créé avec succès et email de bienvenue envoyé.',
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription.', details: error.message });
  }
};


export const getAll = async (req, res) => {
  let users;
  try {
    users = await Service.findAll(User);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).json("User not found!");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateById = async (req, res) => {
  let user;
  const id = req.params.id;

  try {
    // Récupérer l'utilisateur par ID
    user = await Service.get(User, id);
  } catch (error) {
    return res.status(error.status || 500).json({ error: error.error || "Erreur lors de la récupération de l'utilisateur" });
  }

  try {
    // Vérifier si le mot de passe est présent dans les données à mettre à jour
    if (req.body.password) {
      // Hacher le mot de passe avant la mise à jour
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Mettre à jour l'utilisateur avec les nouvelles données
    await user.update(req.body);

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
  }
};
export const deleteById = async (req, res) => {
  let res_destroy;

  try {
    res_destroy = await User.destroy({ where: { id: req.params.id } });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while deleting the user",
      details: error.message,
    });
  }

  if (!res_destroy) return res.status(404).json({ message: "User not found!" });

  return res.status(200).json({ message: "User deleted" });
};

export const checkAuth = async (req, res) => {

  let user;
  let verified;
  const token = req.cookies.access_token; // Assurez-vous que le token est stocké dans les cookies

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied, No Token Provided!" });


  try {
    verified = jwt.verify(token, env.token); 
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }

  try {
    user = await Service.get(User, verified.id);
  } catch (error) {
      return res.status(error.status).json({ error: error.error });
  }

  try {
    const { password, ...other } = user.dataValues; // Évitez d'envoyer le mot de passe dans la réponse
    return res.status(200).json(other); // Renvoie les données utilisateur sans le mot de passe
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const updateByEmail = async (req, res) => {
  const { email } = req.body; // Récupérer l'e-mail du corps de la requête
  let user;

  try {
    // Rechercher l'utilisateur par e-mail directement avec Sequelize
    user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé avec cet e-mail" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erreur lors de la recherche de l'utilisateur", details: error.message });
  }

  try {
    // Vérifier si le mot de passe est présent dans les données à mettre à jour
    if (req.body.password) {
      // Hacher le mot de passe avant la mise à jour
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Mettre à jour l'utilisateur avec les nouvelles données directement
    await user.update(req.body);

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenez l'ID de l'utilisateur connecté à partir du middleware d'authentification
    const user = await User.findByPk(userId, {
      attributes: ['id', 'firstName', 'lastName', 'email'], // Sélectionnez uniquement les champs nécessaires
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil utilisateur.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenez l'ID de l'utilisateur connecté
    const { firstName, lastName, email } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    // Mettez à jour uniquement les champs fournis dans la requête
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      // profilePicture: profilePicture || user.profilePicture,
    });

    res.status(200).json({ message: 'Profil mis à jour avec succès.', user });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil utilisateur :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du profil utilisateur.' });
  }
};
