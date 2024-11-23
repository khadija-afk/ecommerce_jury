import { OrderDetails, OrderItems, Article } from "../models/index.js";
import { verifieToken } from "../auth.js"; // Middleware pour vérifier le token d'authentification

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Récupérer toutes les commandes d'un utilisateur authentifié


// Récupération de __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Obtenir l'ID de l'utilisateur connecté

    // Récupérer les commandes avec leurs items et les détails des articles
    const orders = await OrderDetails.findAll({
      where: { user_fk: userId },
      include: [
        {
          model: OrderItems,
          as: "OrderItems", // Assurez-vous que l'alias est correct dans vos associations Sequelize
          include: [
            {
              model: Article, // Inclure les détails de l'article
              as: "Article", // Assurez-vous que l'alias est correct dans vos associations Sequelize
              attributes: ["id", "name", "price", "photo"], // Limiter les attributs retournés
            },
          ],
        },
      ],
    });

    // Vérifier si des commandes existent
    if (!orders.length) {
      return res.status(404).json({ error: "Aucune commande trouvée" });
    }

    // Retourner les commandes avec leurs items
    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des commandes" });
  }
};

// Récupérer une commande par son ID pour l'utilisateur connecté
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await OrderDetails.findOne({
      where: { id: req.params.id, user_fk: userId },
      include: [
        {
          model: OrderItems,
          as: "OrderItems",
          include: [
            {
              model: Article,
              as: "Article",
              attributes: ["id", "name", "price", "photo"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération de la commande",
    });
  }
};


// Créer une nouvelle commande pour l'utilisateur connecté
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // ID utilisateur connecté
    const { total, items } = req.body;

    // Vérification des données
    if (!total || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Le total de paiement et les articles sont requis",
      });
    }

    // Créer la commande
    const newOrder = await OrderDetails.create({
      user_fk: userId,
      total,
    });

    // Ajouter les articles à la commande
    const orderItems = items.map((item) => ({
      order_fk: newOrder.id,
      product_fk: item.product_fk,
      quantity: item.quantity,
      price: item.price,
    }));
    await OrderItems.bulkCreate(orderItems);

    res.status(201).json({ orderId: newOrder.id });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la création de la commande",
    });
  }
};

// Mettre à jour une commande pour l'utilisateur connecté
export const updateOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté
    const { total, status } = req.body;

    const order = await OrderDetails.findOne({
      where: { id: req.params.id, user_fk: userId },
    });
    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    await order.update({ total, status });
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la mise à jour de la commande" });
  }
};

// Supprimer une commande pour l'utilisateur connecté
export const deleteOrder = async (req, res) => {
  try {
    const userId = req.user.id; // Utiliser l'ID de l'utilisateur connecté
    const order = await OrderDetails.findOne({
      where: { id: req.params.id, user_fk: userId },
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    await order.destroy();
    res.status(200).json({ message: "Commande supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la suppression de la commande" });
  }
};

// API pour générer et télécharger la facture
export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Récupérer les détails de la commande depuis la base de données
    const order = await OrderDetails.findOne({
      where: { id: orderId },
      include: [{ model: OrderItems, include: [Article] }],
    });

    if (!order) {
      return res.status(404).json({ error: "Commande non trouvée" });
    }

    // Créer un document PDF
    const doc = new PDFDocument();

    // Définir les en-têtes HTTP pour le téléchargement
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${orderId}.pdf`
    );

    // Pipe le document PDF directement à la réponse
    doc.pipe(res);

    // Contenu de la facture
    doc.fontSize(18).text(`Facture - Commande N° ${order.id}`, { align: 'center' });
    doc.text('\n');
    doc.fontSize(14).text(`Date : ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Total : ${order.total} €`);
    doc.text(`Statut : ${order.status}`);
    doc.text('\nArticles :\n');

    order.OrderItems.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.Article.name} - ${item.quantity} × ${item.price} €`,
        { indent: 20 }
      );
    });

    // Finaliser et fermer le document
    doc.end();
  } catch (error) {
    console.error('Erreur lors de la génération de la facture :', error);
    res.status(500).json({ error: 'Erreur lors de la génération de la facture' });
  }
};
