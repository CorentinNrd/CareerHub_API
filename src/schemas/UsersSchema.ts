import mongoose from "mongoose";

export const user_schema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {timestamps: true})
