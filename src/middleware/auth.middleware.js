import jwt from 'jsonwebtoken';
import { blackListJwt } from '../models/blacklistjwt.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                statusCode: 401,
                message: 'Unauthorized - No token provided',
            });
        }

        const token = authHeader.split(' ')[1];
        const isblackListJwt = await blackListJwt.findOne({ token });
        if (!isblackListJwt) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            req.token = token;
            next();
        } else {
            return res.status(401).json({
                statusCode: 401,
                message: 'Unauthorized - invalid token provided',
            });
        }
    } catch (error) {
        res.status(401).json({
            statusCode: 401,
            message: error.message || 'Invalid or expired token',
        });
    }
};
