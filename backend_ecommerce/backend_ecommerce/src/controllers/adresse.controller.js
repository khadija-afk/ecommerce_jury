import { Address, User } from "../models/index.js";
import * as Service from "../services/service.js";

// Ajouter une adresse
export const add = async (req, res) => {
    const { address_line1, address_line2, city, state, postal_code, country, phone, type } = req.body;
    const user_fk = req.user.id;

    try {
        const user = await Service.get(User, user_fk); // Vérifie que l'utilisateur existe
        if (!user) {
            return res.status(404).json({ error: "Utilisateur introuvable." });
        }

        const newAddress = await Service.create(Address, {
            user_fk,
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            phone,
            type,
        });

        res.status(201).json(newAddress);
    } catch (error) {
        console.error("Erreur lors de la création de l'adresse :", error);
        res.status(500).json({ error: "Erreur lors de la création de l'adresse." });
    }
};

// Obtenir toutes les adresses d'un utilisateur
export const getAllByUser = async (req, res) => {
    const user_fk = req.user.id;

    try {
        const addresses = await Address.findAll({ where: { user_fk } });
        if (addresses.length === 0) {
            return res.status(404).json({ error: "Aucune adresse trouvée pour cet utilisateur." });
        }

        res.status(200).json(addresses);
    } catch (error) {
        console.error("Erreur lors de la récupération des adresses :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des adresses." });
    }
};

// Obtenir une adresse par son ID
export const getById = async (req, res) => {
    const addressId = req.params.id;

    try {
        const address = await Service.get(Address, addressId);
        if (!address) {
            return res.status(404).json({ error: "Adresse introuvable." });
        }

        // Vérifie que l'utilisateur a le droit d'accéder à cette adresse
        if (address.user_fk !== req.user.id) {
            return res.status(403).json({ error: "Accès interdit." });
        }

        res.status(200).json(address);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'adresse :", error);
        res.status(500).json({ error: "Erreur lors de la récupération de l'adresse." });
    }
};

// Mettre à jour une adresse
export const updateById = async (req, res) => {
    const addressId = req.params.id;
    const { address_line1, address_line2, city, state, postal_code, country, phone, type } = req.body;

    try {
        const address = await Service.get(Address, addressId);
        if (!address) {
            return res.status(404).json({ error: "Adresse introuvable." });
        }

        // Vérifie que l'utilisateur est le propriétaire de l'adresse
        if (address.user_fk !== req.user.id) {
            return res.status(403).json({ error: "Accès interdit." });
        }

        await address.update({
            address_line1,
            address_line2,
            city,
            state,
            postal_code,
            country,
            phone,
            type,
        });

        res.status(200).json(address);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'adresse :", error);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'adresse." });
    }
};

// Supprimer une adresse
export const deleteById = async (req, res) => {
    const addressId = req.params.id;

    try {
        const address = await Service.get(Address, addressId);
        if (!address) {
            return res.status(404).json({ error: "Adresse introuvable." });
        }

        // Vérifie que l'utilisateur est le propriétaire de l'adresse
        if (address.user_fk !== req.user.id) {
            return res.status(403).json({ error: "Accès interdit." });
        }

        await Service.destroy(address);
        res.status(200).json({ message: "Adresse supprimée avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'adresse :", error);
        res.status(500).json({ error: "Erreur lors de la suppression de l'adresse." });
    }
};
