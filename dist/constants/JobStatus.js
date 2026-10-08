"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobStatusLabels = exports.JobStatus = void 0;
var JobStatus;
(function (JobStatus) {
    JobStatus[JobStatus["APPLICATION_SENT"] = 1] = "APPLICATION_SENT";
    JobStatus[JobStatus["REJECTION_RECEIVED"] = 2] = "REJECTION_RECEIVED";
    JobStatus[JobStatus["INTERVIEW"] = 3] = "INTERVIEW";
    JobStatus[JobStatus["APPLICATION_WITHDRAWN"] = 4] = "APPLICATION_WITHDRAWN";
    JobStatus[JobStatus["NO_RESPONSE"] = 5] = "NO_RESPONSE";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
exports.JobStatusLabels = {
    [JobStatus.APPLICATION_SENT]: "Candidature envoyé",
    [JobStatus.REJECTION_RECEIVED]: "Refus reçu",
    [JobStatus.INTERVIEW]: "Entretien",
    [JobStatus.APPLICATION_WITHDRAWN]: "Candidature retirée",
    [JobStatus.NO_RESPONSE]: "Aucune réponse",
};
