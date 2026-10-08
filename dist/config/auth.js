"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSecret = void 0;
const configuredJwtSecret = process.env.JWT_SECRET;
if (!configuredJwtSecret || Buffer.byteLength(configuredJwtSecret, "utf8") < 32) {
    throw new Error("JWT_SECRET doit contenir au moins 32 octets.");
}
exports.jwtSecret = configuredJwtSecret;
