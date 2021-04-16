const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    // get token from header
    const token = req.header('x-auth-token');
    // check if token exists
    if (!token) {
        return res.send(401).json({ msg: "No Token, Authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"))
        req.user = decoded.user;
        next()
    } catch (error) {
        return res.status(401).json({ msg: "Invalid Token" });
    }
}