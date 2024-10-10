import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Cart } from "../models/index.js";
import { env } from "../config.js";

import * as Service from "../services/service.js";

export const login = async (req, res) => {
  let user;
  let email = req.body.email;

  // step 1 : get user
  try {
    user = await User.findOne({ where: { email: email } });
  } catch (err) {
    return res
      .status(501)
      .json({ error: "Erreur lors de la recherche de user" });
  }
  if (!user) return res.status(404).json("User not found!");

  // step 2: validate password
  const comparePassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!comparePassword) {
    return res.status(400).json({ 
        error: "Wrong Credentials!",
        details: "Invalid password."
    });
}

  const token = jwt.sign({ id: user.id }, env.token, { expiresIn: "24h" });
  const { password, ...other } = user.dataValues;

  res.cookie("access_token", token, { httpOnly: true }).status(200).json(other);
};

export const register = async (req, res) => {
    try {
      // Créez d'abord l'utilisateur avec le mot de passe haché
      req.body['password'] = await bcrypt.hash(req.body.password, 10) 
      const user = await Service.create(User, req.body);
  
      // Créez ensuite un panier pour l'utilisateur nouvellement créé
      const body_cart = { 
        user_fk: user.id, 
        total_amount: 0 
      }
      const cart = await Service.create(Cart, body_cart);
  
      return res.status(201).json({
        user,
        cart,
      });
    } catch (error) {
      return res.status(error.status).json({error: error.error})
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