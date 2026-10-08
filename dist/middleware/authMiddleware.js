"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UsersController_1 = require("../controllers/UsersController");
const auth_1 = require("../config/auth");
const verifyToken = (req, res, next) => {
    var _a, _b, _c;
    try {
        const cookieToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        const bearerToken = (_c = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.match(/^Bearer\s+(\S+)$/i)) === null || _c === void 0 ? void 0 : _c[1];
        const token = cookieToken || bearerToken;
        if (!token) {
            return res.status(401).json({ error: "Token manquant" });
        }
        // Vérifier si le token est dans la blacklist
        if (UsersController_1.tokenBlacklist.has(token)) {
            return res.status(401).json({ error: "Token invalide (déconnecté)" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, auth_1.jwtSecret);
        if (typeof decoded === "string" || typeof decoded.userId !== "string" || !decoded.userId) {
            return res.status(401).json({ error: "Token invalide" });
        }
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Token invalide" });
    }
};
exports.verifyToken = verifyToken;
