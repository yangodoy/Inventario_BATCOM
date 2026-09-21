import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

dotenv.config();

const app = express();

// Middlewares estándar
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración CORS para el frontend React local
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Enrutador Principal Modular (/api/v1)
app.use('/api/v1', apiRoutes);

// Manejador centralizado de errores
app.use(errorHandler);

export default app;
