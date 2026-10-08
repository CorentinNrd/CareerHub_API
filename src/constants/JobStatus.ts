export enum JobStatus {
  APPLICATION_SENT = 1,
  REJECTION_RECEIVED = 2,
  INTERVIEW = 3,
  APPLICATION_WITHDRAWN = 4,
  NO_RESPONSE = 5,
}

export const JobStatusLabels: Record<JobStatus, string> = {
  [JobStatus.APPLICATION_SENT]: "Candidature envoyé",
  [JobStatus.REJECTION_RECEIVED]: "Refus reçu",
  [JobStatus.INTERVIEW]: "Entretien",
  [JobStatus.APPLICATION_WITHDRAWN]: "Candidature retirée",
  [JobStatus.NO_RESPONSE]: "Aucune réponse",
};

