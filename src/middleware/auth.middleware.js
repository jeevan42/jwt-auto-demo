import jwtwebtoken from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).send({
                statusCode: 401,
                message: 'unauthorized',
            });
        } else {
            const verifiedToken = jwtwebtoken.verify(token, process.env.JWT_SECRET)
            if (verifiedToken) {
                req.user = verifiedToken
                next();
            } else {
                res.status(401).send({
                    statusCode: 401,
                    message: 'unauthorized',
                });
            }
        }
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            statusCode: 400,
            message: error.message || 'something went wrong'
        });
    }
}