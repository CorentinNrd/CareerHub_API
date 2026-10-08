"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UsersSchema_1 = require("../schemas/UsersSchema");
exports.user = mongoose_1.default.model("user", UsersSchema_1.user_schema);
