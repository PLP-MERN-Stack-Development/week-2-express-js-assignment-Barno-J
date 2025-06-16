const { ValidationError } = require('../errors/customErrors');

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return next(new ValidationError('Invalid or missing API key'));
    }
    next();
};

module.exports = { authMiddleware };