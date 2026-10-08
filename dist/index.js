"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const init_1 = require("./db/init");
const UsersRoutes_1 = require("./routes/UsersRoutes");
const JobRoutes_1 = require("./routes/JobRoutes");
const app = (0, express_1.default)();
const port = process.env.NODE_PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Configuration CORS correcte pour accepter les credentials
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const isAllowedOrigin = !origin ||
            origin === 'http://localhost:5173' ||
            /^chrome-extension:\/\/[a-p]{32}$/.test(origin);
        callback(null, isAllowedOrigin);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((0, cookie_parser_1.default)());
const version = process.env.VERSION_API;
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
app.use(`/v${version}/users`, UsersRoutes_1.user);
app.use(`/v${version}/job`, JobRoutes_1.job);
(0, init_1.run)(process.env.DB_LINK)
    .then(() => {
    console.log('MongoDB connecté');
    app.listen(port, () => {
        console.log(`app listening on port ${port}`);
        console.log(`Swagger disponible à http://localhost:${port}/api-docs`);
    });
})
    .catch((err) => {
    console.error('Erreur connexion MongoDB:', err);
    process.exit(1);
});
