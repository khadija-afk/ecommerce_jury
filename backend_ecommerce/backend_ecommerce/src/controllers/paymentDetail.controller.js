import { PaymentDetails, OrderDetails, Article, User, CartItem, OrderItems, Address } from "../models/index.js";
import * as Service from "../services/service.js";
import { sendConfirmationEmail } from "./email.controller.js";

// Récupérer tous les détails de paiement (avec l'adresse associée)
export const getAllPaymentDetails = async (req, res) => {
  try {
    const paymentDetails = await PaymentDetails.findAll({
      include: [
        {
          model: Address, // Inclure les détails de l'adresse
          attributes: ['id', 'address_line1', 'city', 'postal_code', 'country'],
        },
      ],
    });
    res.status(200).json(paymentDetails);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de paiement :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération des détails de paiement",
    });
  }
};

// Ajouter un nouveau détail de paiement (avec l'adresse associée)
export const addPaymentDetail = async (req, res) => {
  try {
    const { order_fk, amount, provider, status, fk_addr_fk } = req.body;

    if (!order_fk || !amount || !provider || !fk_addr_fk) {
      return res
        .status(400)
        .json({ error: "Tous les champs obligatoires doivent être remplis" });
    }

    // Créer le détail du paiement
    const newPaymentDetail = await PaymentDetails.create({
      order_fk,
      amount,
      provider,
      status,
      fk_addr_fk, // Associer l'adresse
    });

    // Récupérer les détails de l'utilisateur, de la commande et de l'adresse
    const order = await OrderDetails.findByPk(order_fk, {
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email'],
        },
        {
          model: OrderItems,
          include: [
            {
              model: Article,
              attributes: ['name', 'price', 'photo'],
            },
          ],
        },
      ],
    });

    const address = await Address.findByPk(fk_addr_fk);

    // Si le statut est "Paid", envoyer l'e-mail de confirmation
    if (status === 'Paid' && order && order.User) {
      await sendConfirmationEmail(order.User, order, newPaymentDetail, address);
      console.log('E-mail de confirmation envoyé avec les détails de l\'adresse.');
    } else {
      console.log('Statut non "Paid", aucun e-mail envoyé.');
    }

    res.status(201).json(newPaymentDetail);
  } catch (error) {
    console.error("Erreur lors de l'ajout du détail de paiement :", error);
    res.status(500).json({
      error: "Erreur serveur lors de l'ajout du détail de paiement",
    });
  }
};

// Récupérer un détail de paiement par son ID (avec l'adresse associée)
export const getPaymentDetailById = async (req, res) => {
  try {
    const paymentDetail = await PaymentDetails.findByPk(req.params.id, {
      include: [
        {
          model: Address, // Inclure les détails de l'adresse
          attributes: ['id', 'address_line1', 'city', 'postal_code', 'country'],
        },
      ],
    });

    if (!paymentDetail) {
      return res.status(404).json({ error: "Détail de paiement introuvable" });
    }

    res.status(200).json(paymentDetail);
  } catch (error) {
    console.error("Erreur lors de la récupération du détail de paiement :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la récupération du détail de paiement",
    });
  }
};

// Mettre à jour un détail de paiement (avec gestion de l'adresse associée)
export const updatePaymentDetail = async (req, res) => {
  let paymentDetail;

  try {
    paymentDetail = await Service.get(PaymentDetails, req.params.id);
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }

  try {
    const { fk_addr_fk } = req.body;

    // Mettre à jour les détails du paiement
    await paymentDetail.update(req.body);

    // Si une nouvelle adresse est spécifiée, vérifier son existence
    if (fk_addr_fk) {
      const address = await Address.findByPk(fk_addr_fk);
      if (!address) {
        return res.status(404).json({ error: "Adresse associée introuvable" });
      }
    }

    if (req.body.status === 'Paid') {
      const order = await OrderDetails.findByPk(paymentDetail.order_fk, {
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName', 'email'],
          },
          {
            model: OrderItems,
            include: [
              {
                model: Article,
                attributes: ['name', 'price', 'photo'],
              },
            ],
          },
        ],
      });

      if (order && order.User) {
        const address = await Address.findByPk(paymentDetail.fk_addr_fk);
        await sendConfirmationEmail(order.User, order, paymentDetail, address);
        console.log('E-mail de confirmation envoyé après mise à jour en "Paid".');
      }
    }

    res.status(200).json(paymentDetail);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du détail de paiement :", error);
    res.status(500).json({
      error: "Erreur serveur lors de la mise à jour du détail de paiement",
    });
  }
};

// Supprimer un détail de paiement
export const deletePaymentDetail = async (req, res) => {
  const id = req.params.id;
  try {
    const paymentDetail = await Service.get(PaymentDetails, id);
    await Service.destroy(paymentDetail);
    res.status(204).send();
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }
};
