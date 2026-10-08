import {job_model} from "../models/JobModel";
import {JobStatus, JobStatusLabels} from "../constants/JobStatus";

export const create_job = async (req: any, res: any) => {
    try {
        const {title, desc, location, salary, uri, website} = req.body;

        console.log(req.body)

        if ([title, desc, location, website, uri].some(value => typeof value !== "string")) {
            return res.status(400).json({error: "Titre, description, localisation, lien et website doivent être fournis sous forme de texte"});
        }

        if (salary !== undefined && salary !== null && typeof salary !== "string" && typeof salary !== "number") {
            return res.status(400).json({error: "Le salaire doit être fourni sous forme de texte ou de nombre"});
        }

        const normalizedSalary =
            salary === undefined || salary === null
                ? null
                : typeof salary === "number"
                    ? String(salary)
                    : salary.trim() || null;

        await job_model.create({
            userId: req.userId,
            title,
            desc,
            location,
            salary: normalizedSalary,
            website,
            uri,
            status: JobStatus.APPLICATION_SENT
        });

        res.status(201).json({message: "Job créé avec succès"});
    } catch (err) {
        console.error("Erreur create_job:", err);
        res.status(500).json({error: "Erreur lors de la création du job"});
    }
};

export const update_job = async (req: any, res: any) => {
    try {
        const {jobId} = req.params;
        const {title, desc, location, salary, website} = req.body;

        // Vérifier que le job appartient à l'utilisateur
        const jobExists = await job_model.findOne({_id: jobId, userId: req.userId});
        if (!jobExists) {
            return res.status(404).json({error: "Job non trouvé ou accès refusé"});
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (desc) updateData.desc = desc;
        if (location) updateData.location = location;
        if (salary !== undefined) {
            if (salary !== null && typeof salary !== "string" && typeof salary !== "number") {
                return res.status(400).json({error: "Le salaire doit être fourni sous forme de texte ou de nombre"});
            }
            updateData.salary =
                salary === null
                    ? null
                    : typeof salary === "number"
                        ? String(salary)
                        : salary.trim() || null;
        }
        if (website) updateData.website = website;

        await job_model.findByIdAndUpdate(jobId, updateData, {new: true});

        res.json({message: "Job modifié avec succès"});
    } catch (err) {
        console.error("Erreur update_job:", err);
        res.status(500).json({error: "Erreur lors de la modification du job"});
    }
};

export const update_job_status = async (req: any, res: any) => {
    try {
        const {jobId} = req.params;
        let {status} = req.body;

        // Convertir en nombre si c'est une chaîne
        if (typeof status === 'string') {
            status = parseInt(status, 10);
        }

        if (!status || !Object.values(JobStatus).includes(status)) {
            return res.status(400).json({
                error: "Statut invalide. Les statuts valides sont : " + Object.values(JobStatus).join(", ")
            });
        }

        // Vérifier que le job appartient à l'utilisateur
        const jobExists = await job_model.findOne({_id: jobId, userId: req.userId});
        if (!jobExists) {
            return res.status(404).json({error: "Job non trouvé ou accès refusé"});
        }

        await job_model.findByIdAndUpdate(jobId, {status}, {new: true});

        res.json({
            message: "Statut modifié avec succès",
            newStatus: JobStatusLabels[status as JobStatus]
        });
    } catch (err) {
        console.error("Erreur update_job_status:", err);
        res.status(500).json({error: "Erreur lors de la modification du statut"});
    }
};

export const archive_job = async (req: any, res: any) => {
    try {
        const {jobId} = req.params;

        const archivedJob = await job_model.findOneAndUpdate(
            {_id: jobId, userId: req.userId},
            {archivedAt: new Date()},
            {new: true}
        );
        if (!archivedJob) {
            return res.status(404).json({error: "Job non trouvé ou accès refusé"});
        }

        res.json({
            message: "Job archivé avec succès",
            archivedAt: archivedJob.archivedAt
        });
    } catch (err) {
        console.error("Erreur archive_job:", err);
        res.status(500).json({error: "Erreur lors de l'archivage du job"});
    }
};

export const get_all_jobs = async (req: any, res: any) => {
    try {
        // Récupérer les jobs non archivés par défaut
        const jobs = await job_model.find({userId: req.userId, archivedAt: null});
        res.json(jobs);
    } catch (err) {
        console.error("Erreur get_all_jobs:", err);
        res.status(500).json({error: "Erreur lors de la récupération des jobs"});
    }
};

export const get_archived_jobs = async (req: any, res: any) => {
    try {
        // Récupérer les jobs archivés
        const jobs = await job_model.find({userId: req.userId, archivedAt: {$ne: null}});
        res.json(jobs);
    } catch (err) {
        console.error("Erreur get_archived_jobs:", err);
        res.status(500).json({error: "Erreur lors de la récupération des jobs archivés"});
    }
};
