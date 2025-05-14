import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import jsonWebToken from 'jsonwebtoken';


export const SignupHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(403).send({
                statusCode: 403,
                message: 'Validation error or missing fields'
            });
            return;
        };
        const user = await User.findOne({ email });
        if (user) {
            res.status(409).send({
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
            { expiresIn: '1h' }
        );
        res.status(201).send({
            statusCode: 201,
            message: 'user created successfully',
            token
        });

    } catch (error) {
        // console.log(error)
        res.status(400).send({
            statusCode: 400,
            message: 'something went wrong'
        })
    }
};


export const LoginHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(403).send({
                statusCode: 403,
                message: 'Validation error or missing fields'
            });
            return;
        };
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).send({
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
                { expiresIn: '1h' }
            );
            res.status(200).send({
                statusCode: 200,
                message: 'user logged in successfully',
                token
            });
        } else {
            res.status(400).send({
                statusCode: 400,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            statusCode: 400,
            message:  error.message || 'something went wrong'
        });
    };
};

export const GetProfileHandler = async (req, res) => {
    try {
        const { email } = req.user;
        const user = await User.findOne({ email }, 'name email');
        if (!user) {
            res.status(404).send({
                statusCode: 404,
                message: 'User not found',
            });
            return;
        }
        res.status(200).send({
            statusCode: 200,
            message: 'user profile fetched successfully',
            user: user
        });
    } catch (error) {
        res.status(400).send({
            statusCode: 400,
            message:  error.message || 'something went wrong'
        });
    }
}
