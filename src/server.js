import { config } from 'dotenv';
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import authRouter from './routes/auth.routes.js';
import { connectDB } from './db/config.js'

config();
connectDB();
const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.get(`/`, (req, res) => {
    res.send(`Welcome Buddy!`)
})
app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`App Listening on PORT ${PORT}`)
});

