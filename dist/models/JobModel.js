"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.job_model = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema_1 = require("../schemas/JobSchema");
exports.job_model = mongoose_1.default.model("job", JobSchema_1.job_schema);
