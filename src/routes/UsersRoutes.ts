import express from "express";
import {register, login, logout, verifyAuth} from "../controllers/UsersController"
import {verifyToken} from "../middleware/authMiddleware"

const router = express.Router()

/**
 * @swagger
 * /v1/users/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', register)

/**
 * @swagger
 * /v1/users/login:
 *   post:
 *     summary: Se connecter
 *     tags: [Users]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', login)

router.use(verifyToken)

/**
 * @swagger
 * /v1/users/logout:
 *   post:
 *     summary: Se déconnecter
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *       401:
 *         description: Token invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/logout', logout)

/**
 * @swagger
 * /v1/users/verify:
 *   get:
 *     summary: Vérifier si le token est valide
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                 userId:
 *                   type: string
 *       401:
 *         description: Token invalide
 */
router.get('/verify', verifyAuth)

export { router as user };