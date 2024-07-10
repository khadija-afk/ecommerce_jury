import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { env } from '../config.js';

export const login = async (req, res) => {
  try {
    const user = await User.findOne({where : {email: req.body.email} });
    if (!user) return res.status(404).json("User not found!");

    const comparePassword = await bcrypt.compare(req.body.password, user.password);
    console.log("compare",comparePassword,"body", req.body.password, "user", user)
    if (!comparePassword) return res.status(400).json("Wrong Credentials!");

    const token = jwt.sign({ id: user.id }, env.token, { expiresIn: "24h" });

  const { password, ...other } = user.dataValues;
/*const other = {
  id: req.body.user_id,
  name: req.body.firstName,
  email: req.body.email,
  picture: req.body.picture
}*/
    res.cookie('access_token', token, { httpOnly: true })
      .status(200).json(other);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error", mess: e.messsage });
  }
};

export const register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User has been created!",
      user
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", mess: error.message  });
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