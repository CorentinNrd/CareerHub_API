import mongoose from "mongoose";

export const job_schema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
    title: {type: String},
    desc: {type: String},
    location: {type: String},
    salary: {type: String, required: false},
    website: {type: String},
    uri: {type: String, required: true},
    status: {type: Number, enum: [1, 2, 3, 4, 5], default: 1},
    archivedAt: {type: Date, default: null}
}, {timestamps: true})
