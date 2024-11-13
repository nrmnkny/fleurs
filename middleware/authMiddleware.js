const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Authenticating request with token:", token);

    if (!token) {
        console.warn("No token provided");
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log("Token verified successfully:", verified);
        next();
    } catch (err) {
        console.error("Invalid token:", err.message);
        res.status(401).json({ message: 'Invalid Token' });
    }
};

module.exports = authMiddleware;
