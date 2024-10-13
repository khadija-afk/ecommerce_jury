import express from "express";

  import {
  login,
  register,
  getAll,
  getById,
  updateById,
  deleteById,
  checkAuth, 
  updateByEmail
}from "../controllers/user.controller.js";

const router = express.Router();



router.post("/sign", login);
router.post("/add", register);
// Route pour obtenir tous les utilisateurs
router.get("/all", getAll);
// Route pour obtenir un utilisateur spécifique par son ID
router.get("/get/:id", getById);
// Route pour mettre à jour un utilisateur spécifique par son ID
router.put("/update/:id", updateById);
// Route pour mettre à jour un utilisateur spécifique par son email
router.put("/update", updateByEmail);
// Route pour supprimer un utilisateur spécifique par son ID
router.delete("/delete/:id", deleteById);
// Route pour la vérification d'authentification
router.get('/check_auth', checkAuth);


export default router;
