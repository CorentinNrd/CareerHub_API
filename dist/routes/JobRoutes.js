"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.job = void 0;
const express_1 = __importDefault(require("express"));
const JobController_1 = require("../controllers/JobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
exports.job = router;
router.use(authMiddleware_1.verifyToken);
/**
 * @swagger
 * /v1/job/create:
 *   post:
 *     summary: Créer un nouveau job
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - desc
 *               - location
 *               - website
 *               - uri
 *             properties:
 *               title:
 *                 type: string
 *                 description: Peut être vide si l'information n'a pas été récupérée
 *               desc:
 *                 type: string
 *                 description: Peut être vide si l'information n'a pas été récupérée
 *               location:
 *                 type: string
 *                 description: Peut être vide si l'information n'a pas été récupérée
 *               salary:
 *                 type: string
 *                 description: Peut contenir un montant ou une fourchette avec sa période
 *               website:
 *                 type: string
 *                 description: Nom de l'entreprise ayant publié l'offre, peut être vide si non détecté
 *               uri:
 *                 type: string
 *                 description: Lien vers l'offre d'emploi
 *     responses:
 *       201:
 *         description: Job créé avec succès
 *       400:
 *         description: Données manquantes
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/create', JobController_1.create_job);
/**
 * @swagger
 * /v1/job/all:
 *   get:
 *     summary: Récupérer tous les jobs non archivés
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/all', JobController_1.get_all_jobs);
/**
 * @swagger
 * /v1/job/archived:
 *   get:
 *     summary: Récupérer les jobs archivés
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des jobs archivés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/archived', JobController_1.get_archived_jobs);
/**
 * @swagger
 * /v1/job/{jobId}:
 *   put:
 *     summary: Modifier les informations d'un job
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               desc:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: string
 *                 description: Peut contenir un montant ou une fourchette avec sa période
 *               website:
 *                 type: string
 *                 description: Nom de l'entreprise ayant publié l'offre
 *     responses:
 *       200:
 *         description: Job modifié avec succès
 *       400:
 *         description: Salaire invalide
 *       404:
 *         description: Job non trouvé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.put('/:jobId', JobController_1.update_job);
/**
 * @swagger
 * /v1/job/{jobId}/status:
 *   patch:
 *     summary: Modifier le statut d'un job
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: number
 *                 enum: [1, 2, 3, 4, 5]
 *                 description: 1=Candidature envoyé, 2=Refus reçu, 3=Entretien, 4=Candidature retirée, 5=Aucune réponse
 *     responses:
 *       200:
 *         description: Statut modifié avec succès
 *       400:
 *         description: Statut invalide
 *       404:
 *         description: Job non trouvé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:jobId/status', JobController_1.update_job_status);
/**
 * @swagger
 * /v1/job/{jobId}/archive:
 *   delete:
 *     summary: Archiver un job
 *     tags: [Jobs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job archivé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 archivedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Job non trouvé
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:jobId/archive', JobController_1.archive_job);
