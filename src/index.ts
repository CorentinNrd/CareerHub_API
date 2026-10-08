import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import {swaggerSpec} from './config/swagger'
import {run} from './db/init'

import {user} from './routes/UsersRoutes'
import {job} from './routes/JobRoutes'

const app = express();
const port = process.env.NODE_PORT

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Configuration CORS correcte pour accepter les credentials
app.use(cors({
  origin: (origin, callback) => {
    const isAllowedOrigin =
      !origin ||
      origin === 'http://localhost:5173' ||
      /^chrome-extension:\/\/[a-p]{32}$/.test(origin);
    callback(null, isAllowedOrigin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());

const version = process.env.VERSION_API

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(`/v${version}/users`, user)
app.use(`/v${version}/job`, job)

run(process.env.DB_LINK as string)
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
