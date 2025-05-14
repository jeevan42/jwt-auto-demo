import mongoose from "mongoose";

const blackListJwtSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: true
    }
}, {
    timestamps: true
});

export const blackListJwt = new mongoose.model(`blackListJwt`, blackListJwtSchema);