import { PaymentDetails, OrderDetails, Article, User, CartItem, OrderItems } from "../models/index.js";
import * as Service from "../services/service.js";
import { sendConfirmationEmail } from "./email.controller.js";

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
// Ajouter un nouveau détail de paiement (protégé)
export const addPaymentDetail = async (req, res) => {
  try {
    const { order_fk, amount, provider, status } = req.body;

    if (!order_fk || !amount || !provider) {
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
    });

    // Récupérer les détails de l'utilisateur et de la commande
    const order = await OrderDetails.findByPk(order_fk, {
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email'], // Ajouter les champs nécessaires
        },
        {
          model: OrderItems,
          include: [
            {
              model: Article,
              attributes: ['name', 'price', 'photo'], // Récupérer les détails des articles
            },
          ],
        },
      ],
    });

   // Vérifiez que le paiement est "Paid" avant d'envoyer l'e-mail
   if (status === 'Paid' && order && order.User) {
    await sendConfirmationEmail(order.User, order, newPaymentDetail);
    console.log('E-mail de confirmation envoyé.');
  } else {
    console.log('Statut non "Paid", aucun e-mail envoyé.');
  }

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
    // Récupérer les détails du paiement existant
    paymentDetail = await Service.get(PaymentDetails, req.params.id);
  } catch (error) {
    return res.status(error.status).json({ error: error.error });
  }

  try {
    // Mettre à jour les détails du paiement avec les données reçues
    await paymentDetail.update(req.body);

    // Si le statut est mis à jour en "Paid", envoyer l'e-mail de confirmation
    if (req.body.status === 'Paid') {
      // Récupérer les détails de l'utilisateur et de la commande associés
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
        // Appeler la fonction d'envoi d'e-mail avec les détails de l'utilisateur, de la commande et du paiement
        await sendConfirmationEmail(order.User, order, paymentDetail);
        console.log('E-mail de confirmation envoyé après mise à jour en "Paid".');
      }
    }

    // Envoyer la réponse au client avec les détails mis à jour
    res.status(200).json(paymentDetail);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du détail de paiement :",
      error,
    );
    res.status(500).json({
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
