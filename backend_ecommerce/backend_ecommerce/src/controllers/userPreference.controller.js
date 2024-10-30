// controllers/cookieConsentController.js

import { UserPreference } from "../models/index.js";

// Enregistrer le consentement de l'utilisateur pour les cookies
export const saveConsent = async (req, res) => {
  const { userId, consent } = req.body;

  try {
    // Vérifier si une préférence de consentement existe déjà pour cet utilisateur
    let preference = await UserPreference.findOne({ where: { userId } });

    if (preference) {
      // Mettre à jour le consentement existant
      preference.consent = consent;
      await preference.save();
    } else {
      // Créer une nouvelle entrée si elle n'existe pas
      await UserPreference.create({ userId, consent });
    }

    res.status(200).json({ message: 'Consentement sauvegardé.' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du consentement:', error);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde du consentement.' });
  }
};

// Récupérer le consentement de l'utilisateur
export const getConsent = async (req, res) => {
  const { userId } = req.params;

  try {
    const preference = await UserPreference.findOne({ where: { userId } });

    if (preference) {
      res.status(200).json({ consent: preference.consent });
    } else {
      res.status(404).json({ message: 'Consentement non trouvé.' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du consentement:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du consentement.' });
  }
};
