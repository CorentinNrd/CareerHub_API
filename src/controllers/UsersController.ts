import {user} from "../models/UsersModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {jwtSecret} from "../config/auth";

// Blacklist de tokens (en prod, utilise Redis)
export const tokenBlacklist = new Set<string>();

export const register = async (req: any, res: any) => {
    try {
        const {email, password, passwordConfirm} = req.body;

        // Validation basique
        if (!email || !password || !passwordConfirm) {
            return res.status(400).json({error: "Email et mots de passe requis"});
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({error: "Les mots de passe ne correspondent pas"});
        }

        if (password.length < 6) {
            return res.status(400).json({error: "Le mot de passe doit contenir au moins 6 caractères"});
        }

        // Vérifier si l'email existe déjà
        const existingUser = await user.findOne({email});
        if (existingUser) {
            return res.status(400).json({error: "Cet email est déjà utilisé"});
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        await user.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({message: "Utilisateur créé avec succès"});
    } catch (err) {
        console.error("Erreur register:", err);
        res.status(500).json({error: "Erreur serveur"});
    }
};

export const login = async (req: any, res: any) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Email et mot de passe requis"});
        }

        // Trouver l'utilisateur
        const foundUser = await user.findOne({email});
        if (!foundUser) {
            return res.status(401).json({error: "Email ou mot de passe incorrect"});
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({error: "Email ou mot de passe incorrect"});
        }

        // Générer le JWT
        const token = jwt.sign({userId: foundUser._id}, jwtSecret, {expiresIn: "7d"});

        // Stocker le token dans un cookie HttpOnly
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
        });

        res.json({message: "Connexion réussie", token});
    } catch (err) {
        console.error("Erreur login:", err);
        res.status(500).json({error: "Erreur serveur"});
    }
};

export const logout = async (req: any, res: any) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (token) {
            // Ajouter le token à la blacklist
            tokenBlacklist.add(token);
        }

        res.clearCookie("token");
        res.json({message: "Déconnexion réussie"});
    } catch (err) {
        console.error("Erreur logout:", err);
        res.status(500).json({error: "Erreur serveur"});
    }
};

export const verifyAuth = async (req: any, res: any) => {
    try {
        // Si on arrive ici, c'est que le middleware authMiddleware a validé le token
        res.json({isAuthenticated: true, userId: req.userId});
    } catch (err) {
        console.error("Erreur verifyAuth:", err);
        res.status(401).json({isAuthenticated: false});
    }
};
