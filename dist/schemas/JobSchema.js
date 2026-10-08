"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.job_schema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.job_schema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true },
    title: { type: String },
    desc: { type: String },
    location: { type: String },
    salary: { type: String, required: false },
    website: { type: String },
    uri: { type: String, required: true },
    status: { type: Number, enum: [1, 2, 3, 4, 5], default: 1 },
    archivedAt: { type: Date, default: null }
}, { timestamps: true });
