// auth.js
import jwt from 'jsonwebtoken';
import { env } from './config.js';
import { createError } from './error.js';

export const verifieToken = (req, res, next) => {
    const token = req.cookies.access_token;

    console.log("___verifieToken: Received token:", token);

    if (!token) {
        console.error("___verifieToken: No token provided");
        return next(createError(401, "Accès interdit, aucun token fourni"));
    }

    jwt.verify(token, env.token, (err, user) => {
        if (err) {
            console.error("___verifieToken: Invalid token:", err.message);
            return next(createError(403, "Token non valide !"));
        }

        if (!user.id) {
            console.error("___verifieToken: Missing user ID in token");
            return res.status(402).json({ error: 'user id not found in jwt' });
        }

        req.user = user;
        console.log("___verifieToken: User authenticated:", user);
        next();
    });
};
