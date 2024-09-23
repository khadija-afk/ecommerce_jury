import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Cart } from '../models/index.js';
import { env } from '../config.js';

export const login = async (req, res) => {
  let user;
  let email = req.body.email;

  // step 1 : get user
  try {
    user = await User.findOne({where : {email: email} });

  } catch (err) {
      return res.status(501).json({ error: "Erreur lors de la recherche de user" });
  }
  if (!user) return res.status(404).json("User not found!");

  // step 2: validate password
  const comparePassword = await bcrypt.compare(req.body.password, user.password);
  if (!comparePassword) return res.status(400).json("Wrong Credentials!");

  const token = jwt.sign({ id: user.id }, env.token, { expiresIn: "24h" });
  const { password, ...other } = user.dataValues;

  res.cookie('access_token', token, { httpOnly: true })
    .status(200).json(other);
};

export const register = async (req, res) => {
  try {
    // Hash du mot de passe de l'utilisateur
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });

    // Créer un panier pour cet utilisateur
  const cart = await Cart.create({
      user_fk: user.id, // Lier le panier au nouvel utilisateur
      total_amount: 0   // Initialiser le total du panier à 0
    });

    res.status(201).json({
      message: "User and Cart have been created!",
      user, 
      cart // Retourne aussi le panier
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", mess: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await User.findAll(); // Utilisation de findAll() au lieu de find()
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
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
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    await user.update(req.body);

    res.status(200).json({
      message: "User updated",
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
      // Utilise la méthode destroy de Serquelize pour supprimer l'utilisateur avec l'ID spécifié
      const userDeleted = await User.destroy({ where: { id: req.params.id } });
      // Si l'utilisateur n'est pas trouvé, renvoie le statut 404 (Non trouvé) et un message d'erreur
      if (!userDeleted) return res.status(404).json("User not found !");
      // Si tout se passe bien, renvoie le statut 200 (OK) et un message de confirmation
      res.status(200).json({ message: "User deleted" });
  } catch (error) {
      // Log l'erreur si quelque chose se passe mal
      console.log(error);
  }
}

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.access_token; // Assurez-vous que le token est stocké dans les cookies
    if (!token) return res.status(401).json({ message: "Access Denied, No Token Provided!" });

    const verified = jwt.verify(token, env.token); // Vérifiez le token avec votre clé secrète
    const user = await User.findByPk(verified.id); // Récupérez les informations de l'utilisateur à partir de la base de données

    if (!user) return res.status(404).json({ message: "User not found!" });

    const { password, ...other } = user.dataValues; // Évitez d'envoyer le mot de passe dans la réponse

    res.status(200).json(other); // Renvoie les données utilisateur sans le mot de passe
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};