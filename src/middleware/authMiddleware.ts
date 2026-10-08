import jwt from "jsonwebtoken";
import {tokenBlacklist} from "../controllers/UsersController";
import {jwtSecret} from "../config/auth";

export const verifyToken = (req: any, res: any, next: any) => {
    try {
        const cookieToken = req.cookies?.token;
        const bearerToken = req.headers.authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];
        const token = cookieToken || bearerToken;

        if (!token) {
            return res.status(401).json({error: "Token manquant"});
        }

        // Vérifier si le token est dans la blacklist
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({error: "Token invalide (déconnecté)"});
        }

        const decoded = jwt.verify(token, jwtSecret);
        if (typeof decoded === "string" || typeof decoded.userId !== "string" || !decoded.userId) {
            return res.status(401).json({error: "Token invalide"});
        }

        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({error: "Token invalide"});
    }
};
