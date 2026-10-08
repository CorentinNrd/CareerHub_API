"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = exports.logout = exports.login = exports.register = exports.tokenBlacklist = void 0;
const UsersModel_1 = require("../models/UsersModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
// Blacklist de tokens (en prod, utilise Redis)
exports.tokenBlacklist = new Set();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, passwordConfirm } = req.body;
        // Validation basique
        if (!email || !password || !passwordConfirm) {
            return res.status(400).json({ error: "Email et mots de passe requis" });
        }
        if (password !== passwordConfirm) {
            return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères" });
        }
        // Vérifier si l'email existe déjà
        const existingUser = yield UsersModel_1.user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé" });
        }
        // Hasher le mot de passe
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Créer l'utilisateur
        yield UsersModel_1.user.create({
            email,
            password: hashedPassword
        });
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    }
    catch (err) {
        console.error("Erreur register:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis" });
        }
        // Trouver l'utilisateur
        const foundUser = yield UsersModel_1.user.findOne({ email });
        if (!foundUser) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
        // Vérifier le mot de passe
        const isPasswordValid = yield bcryptjs_1.default.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        }
        // Générer le JWT
        const token = jsonwebtoken_1.default.sign({ userId: foundUser._id }, auth_1.jwtSecret, { expiresIn: "7d" });
        // Stocker le token dans un cookie HttpOnly
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });
        res.json({ message: "Connexion réussie", token });
    }
    catch (err) {
        console.error("Erreur login:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
        if (token) {
            // Ajouter le token à la blacklist
            exports.tokenBlacklist.add(token);
        }
        res.clearCookie("token");
        res.json({ message: "Déconnexion réussie" });
    }
    catch (err) {
        console.error("Erreur logout:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
exports.logout = logout;
const verifyAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Si on arrive ici, c'est que le middleware authMiddleware a validé le token
        res.json({ isAuthenticated: true, userId: req.userId });
    }
    catch (err) {
        console.error("Erreur verifyAuth:", err);
        res.status(401).json({ isAuthenticated: false });
    }
});
exports.verifyAuth = verifyAuth;
