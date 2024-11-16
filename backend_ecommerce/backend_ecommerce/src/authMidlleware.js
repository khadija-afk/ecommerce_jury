// authMiddleware.js
export const verifyRole = (roles) => (req, res, next) => {
    if (!req.user) {
        console.error("___verifyRole: User object not found in request");
        return res.status(401).json({ error: "Non authentifié" });
    }

    if (!roles.includes(req.user.role)) {
        console.error(`___verifyRole: Access denied for role: ${req.user.role}`);
        return res.status(403).json({ error: "Accès interdit" });
    }

    console.log(`___verifyRole: Access granted for role: ${req.user.role}`);
    next();
};
