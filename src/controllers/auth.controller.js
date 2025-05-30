import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import jsonWebToken from 'jsonwebtoken';
import { blackListJwt } from '../models/blacklistjwt.model.js';


export const SignupHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(403).json({
                statusCode: 403,
                message: 'Validation error or missing fields'
            });
            return;
        };
        const user = await User.findOne({ email });
        if (user) {
            res.status(409).json({
                statusCode: 409,
                message: 'User already exists, please login',
            });
            return;
        }
        const saltPass = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltPass);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        })
        await newUser.save();

        const token = jsonWebToken.sign(
            { name, email },
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );
        const refreshToken = jsonWebToken.sign(
            { name, email },
            process.env.REFRESH_JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // ❌ false on localhost (✅ true only in production with HTTPS)
            sameSite: 'Lax', // Or 'Strict' for tighter control
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            statusCode: 201,
            message: 'user created successfully',
            token
        });

    } catch (error) {
        // console.log(error)
        res.status(400).json({
            statusCode: 400,
            message: 'something went wrong'
        })
    }
};


export const LoginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(403).json({
                statusCode: 403,
                message: 'Validation error or missing fields'
            });
            return;
        };
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                statusCode: 404,
                message: 'User not found',
            });
            return;
        }
        const comparedPassword = await bcrypt.compare(password, user.password);
        if (comparedPassword) {
            const token = jsonWebToken.sign(
                { name: user.name, email },
                process.env.JWT_SECRET,
                { expiresIn: '2m' }
            );
            const refreshToken = jsonWebToken.sign(
                { name: user.name, email },
                process.env.REFRESH_JWT_SECRET,
                { expiresIn: '7d' }
            );
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // ❌ false on localhost (✅ true only in production with HTTPS)
                sameSite: 'Lax', // Or 'Strict' for tighter control
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            res.status(200).json({
                statusCode: 200,
                message: 'user logged in successfully',
                token
            });
        } else {
            res.status(400).json({
                statusCode: 400,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        // console.log(error)
        res.status(400).json({
            statusCode: 400,
            message: error.message || 'something went wrong'
        });
    };
};

export const GetProfileHandler = async (req, res) => {
    try {
        const { email } = req.user;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                statusCode: 404,
                message: 'User not found',
            });
            return;
        }
        res.status(200).json({
            statusCode: 200,
            message: 'user profile fetched successfully',
            user: user
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: error.message || 'something went wrong'
        });
    }
};

export const LogoutHandler = async (req, res) => {
    try {
        const token = req.token;
        const isblackListJwt = await blackListJwt.findOne({ token });
        if (!isblackListJwt) {
            // await new blackListJwt({ token }).save();
            const newBlackListJwt = new blackListJwt({
                token,
            })
            await newBlackListJwt.save();
            return res.status(200).json({
                statusCode: 200,
                message: 'User logged out successfully',
            });
        } else {
            return res.status(200).json({
                statusCode: 200,
                message: 'User already logged out',
            });
        }
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: error.message || 'something went wrong'
        });
    }
};

export const refreshTokenHandler = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        const decoded = jsonWebToken.verify(token, process.env.REFRESH_JWT_SECRET);
        const newAccessToken = jsonWebToken.sign(
            { name: decoded.name, email: decoded.email },
            process.env.JWT_SECRET,
            { expiresIn: '2m' }
        );
        const newRefreshToken = jsonWebToken.sign(
            { name: decoded.name, email: decoded.email },
            process.env.REFRESH_JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false, // ❌ false on localhost (✅ true only in production with HTTPS)
            sameSite: 'Lax', // Or 'Strict' for tighter control
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.status(200).json({
            statusCode: 200,
            message: 'User access token refreshed successfully',
            token: newAccessToken
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: error.message || 'something went wrong'
        });
    }
}

