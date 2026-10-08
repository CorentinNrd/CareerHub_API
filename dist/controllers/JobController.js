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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_archived_jobs = exports.get_all_jobs = exports.archive_job = exports.update_job_status = exports.update_job = exports.create_job = void 0;
const JobModel_1 = require("../models/JobModel");
const JobStatus_1 = require("../constants/JobStatus");
const create_job = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, desc, location, salary, uri, website } = req.body;
        console.log(req.body);
        if ([title, desc, location, website, uri].some(value => typeof value !== "string")) {
            return res.status(400).json({ error: "Titre, description, localisation, lien et website doivent être fournis sous forme de texte" });
        }
        if (salary !== undefined && salary !== null && typeof salary !== "string" && typeof salary !== "number") {
            return res.status(400).json({ error: "Le salaire doit être fourni sous forme de texte ou de nombre" });
        }
        const normalizedSalary = salary === undefined || salary === null
            ? null
            : typeof salary === "number"
                ? String(salary)
                : salary.trim() || null;
        yield JobModel_1.job_model.create({
            userId: req.userId,
            title,
            desc,
            location,
            salary: normalizedSalary,
            website,
            uri,
            status: JobStatus_1.JobStatus.APPLICATION_SENT
        });
        res.status(201).json({ message: "Job créé avec succès" });
    }
    catch (err) {
        console.error("Erreur create_job:", err);
        res.status(500).json({ error: "Erreur lors de la création du job" });
    }
});
exports.create_job = create_job;
const update_job = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const { title, desc, location, salary, website } = req.body;
        // Vérifier que le job appartient à l'utilisateur
        const jobExists = yield JobModel_1.job_model.findOne({ _id: jobId, userId: req.userId });
        if (!jobExists) {
            return res.status(404).json({ error: "Job non trouvé ou accès refusé" });
        }
        const updateData = {};
        if (title)
            updateData.title = title;
        if (desc)
            updateData.desc = desc;
        if (location)
            updateData.location = location;
        if (salary !== undefined) {
            if (salary !== null && typeof salary !== "string" && typeof salary !== "number") {
                return res.status(400).json({ error: "Le salaire doit être fourni sous forme de texte ou de nombre" });
            }
            updateData.salary =
                salary === null
                    ? null
                    : typeof salary === "number"
                        ? String(salary)
                        : salary.trim() || null;
        }
        if (website)
            updateData.website = website;
        yield JobModel_1.job_model.findByIdAndUpdate(jobId, updateData, { new: true });
        res.json({ message: "Job modifié avec succès" });
    }
    catch (err) {
        console.error("Erreur update_job:", err);
        res.status(500).json({ error: "Erreur lors de la modification du job" });
    }
});
exports.update_job = update_job;
const update_job_status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        let { status } = req.body;
        // Convertir en nombre si c'est une chaîne
        if (typeof status === 'string') {
            status = parseInt(status, 10);
        }
        if (!status || !Object.values(JobStatus_1.JobStatus).includes(status)) {
            return res.status(400).json({
                error: "Statut invalide. Les statuts valides sont : " + Object.values(JobStatus_1.JobStatus).join(", ")
            });
        }
        // Vérifier que le job appartient à l'utilisateur
        const jobExists = yield JobModel_1.job_model.findOne({ _id: jobId, userId: req.userId });
        if (!jobExists) {
            return res.status(404).json({ error: "Job non trouvé ou accès refusé" });
        }
        yield JobModel_1.job_model.findByIdAndUpdate(jobId, { status }, { new: true });
        res.json({
            message: "Statut modifié avec succès",
            newStatus: JobStatus_1.JobStatusLabels[status]
        });
    }
    catch (err) {
        console.error("Erreur update_job_status:", err);
        res.status(500).json({ error: "Erreur lors de la modification du statut" });
    }
});
exports.update_job_status = update_job_status;
const archive_job = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = req.params;
        const archivedJob = yield JobModel_1.job_model.findOneAndUpdate({ _id: jobId, userId: req.userId }, { archivedAt: new Date() }, { new: true });
        if (!archivedJob) {
            return res.status(404).json({ error: "Job non trouvé ou accès refusé" });
        }
        res.json({
            message: "Job archivé avec succès",
            archivedAt: archivedJob.archivedAt
        });
    }
    catch (err) {
        console.error("Erreur archive_job:", err);
        res.status(500).json({ error: "Erreur lors de l'archivage du job" });
    }
});
exports.archive_job = archive_job;
const get_all_jobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Récupérer les jobs non archivés par défaut
        const jobs = yield JobModel_1.job_model.find({ userId: req.userId, archivedAt: null });
        res.json(jobs);
    }
    catch (err) {
        console.error("Erreur get_all_jobs:", err);
        res.status(500).json({ error: "Erreur lors de la récupération des jobs" });
    }
});
exports.get_all_jobs = get_all_jobs;
const get_archived_jobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Récupérer les jobs archivés
        const jobs = yield JobModel_1.job_model.find({ userId: req.userId, archivedAt: { $ne: null } });
        res.json(jobs);
    }
    catch (err) {
        console.error("Erreur get_archived_jobs:", err);
        res.status(500).json({ error: "Erreur lors de la récupération des jobs archivés" });
    }
});
exports.get_archived_jobs = get_archived_jobs;
