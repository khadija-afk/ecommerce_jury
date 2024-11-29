import speakeasy from 'speakeasy';

/**
 * Vérifie le code TOTP (One-Time Password) généré par l'utilisateur.
 *
 * @param {string} secret - La clé secrète de l'utilisateur pour l'A2F.
 * @param {string} token - Le code OTP envoyé par l'utilisateur.
 * @returns {object} - Retourne un objet avec un booléen et un message d'erreur.
 */
export const verifyTOTP = (secret, token) => {
    const delta = speakeasy.totp.verifyDelta({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1, // Vérifie un code avant/après le code actuel
    });

    if (!delta) {
        return { isValid: false, error: 'Code invalide ou expiré.' };
    }

    return { isValid: true, delta: delta.delta }; // `delta` indique la différence de fenêtre temporelle
};
