const jwt = require('jsonwebtoken');
const serverConfig = require('../config');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, serverConfig.JWT_STRING);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            req.decoded = userId;
            next();
        }
    } catch {
        res.status(401).json({
        error: new Error('Invalid request !')
        });
    }
};