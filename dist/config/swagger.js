"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CareerHub API',
            version: '1.0.0',
            description: 'API de gestion des candidatures d\'emploi',
        },
        servers: [
            {
                url: `http://localhost:${process.env.NODE_PORT || 3003}`,
                description: 'Serveur de développement',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        email: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Job: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        title: { type: 'string' },
                        desc: { type: 'string' },
                        location: { type: 'string' },
                        salary: {
                            type: 'string',
                            description: 'Montant ou fourchette de salaire avec sa période si disponible',
                        },
                        website: {
                            type: 'string',
                            description: "Nom de l'entreprise ayant publié l'offre",
                        },
                        status: { type: 'number', enum: [1, 2, 3, 4, 5] },
                        archivedAt: { type: 'string', format: 'date-time', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: [
        './src/routes/UsersRoutes.ts',
        './src/routes/JobRoutes.ts',
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
