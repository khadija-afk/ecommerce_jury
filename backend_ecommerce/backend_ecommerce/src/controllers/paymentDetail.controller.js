import { PaymentDetails } from "../models/index.js";
import * as Service from "../services/service.js";

// Récupérer tous les détails de paiement (protégé)
export const getAllPaymentDetails = async (req, res) => {
  try {
    const paymentDetails = await PaymentDetails.findAll();
    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de paiement :",
      error,
    );
    res
      .status(500)
      .json({
        error: "Erreur serveur lors de la récupération des détails de paiement",
      });
  }
};

// Récupérer un détail de paiement par son ID (protégé)
export const getPaymentDetailById = async (req, res) => {
  try {
    const paymentDetail = await Service.get(PaymentDetails, req.params.id);
    res.status(200).json(paymentDetail);
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }
};

// Ajouter un nouveau détail de paiement (protégé)
export const addPaymentDetail = async (req, res) => {
  try {
    const { order_fk, amount, provider, status } = req.body;

    if (!order_fk || !amount || !provider) {
      return res
        .status(400)
        .json({ error: "Tous les champs obligatoires doivent être remplis" });
    }

    const newPaymentDetail = await PaymentDetails.create({
      order_fk,
      amount,
      provider,
      status,
    });
    res.status(201).json(newPaymentDetail);
  } catch (error) {
    console.error("Erreur lors de l'ajout du détail de paiement :", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de l'ajout du détail de paiement" });
  }
};

// Mettre à jour un détail de paiement (protégé)
export const updatePaymentDetail = async (req, res) => {

  let paymentDetail;

  try {

    paymentDetail = await Service.get(PaymentDetails, req.params.id);
  } catch (error) {
      return res.status(error.status).json({ error: error.error });
  }
  try {
    
    await paymentDetail.update(req.body);
    res.status(200).json(paymentDetail);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du détail de paiement :",
      error,
    );
    res
      .status(500)
      .json({
        error: "Erreur serveur lors de la mise à jour du détail de paiement",
      });
  }
};

// Supprimer un détail de paiement (protégé)
export const deletePaymentDetail = async (req, res) => {
  const id = req.params.id;
  let paymentDetail;
  try {
    paymentDetail = await Service.get(PaymentDetails, id);
    await Service.destroy(paymentDetail);
    res.status(204).send();
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
   
  }
};
