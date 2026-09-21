import { Router } from 'express';
import equipmentRoutes from './equipmentRoutes.ts';
import custodyRoutes from './custodyRoutes.ts';
import maintenanceRoutes from './maintenanceRoutes.ts';
import militaryUnitRoutes from './militaryUnitRoutes.ts';
import authRoutes from './authRoutes.ts';
import { dbConfig } from '../config/database.ts';

const router = Router();

// Endpoint de verificación táctica de estado del API y DB
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OPERATIONAL',
    system: 'SIGIN-MIL - Sistema de Inventario TIC y Comunicaciones Militares',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      dialect: dbConfig.dialect,
      host: dbConfig.host,
      name: dbConfig.database,
      status: 'CONNECTED_OR_MOCKED',
    },
    modules: ['equipment', 'custody', 'maintenance', 'units', 'auth'],
  });
});

// Montaje de rutas modulares
router.use('/equipment', equipmentRoutes);
router.use('/custody', custodyRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/units', militaryUnitRoutes);
router.use('/auth', authRoutes);

export default router;
