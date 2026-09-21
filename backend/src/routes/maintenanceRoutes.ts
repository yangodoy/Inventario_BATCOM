import { Router } from 'express';
import { maintenanceController } from '../controllers/maintenanceController.ts';

const router = Router();

router.get('/', maintenanceController.getAllMaintenance);
router.post('/schedule', maintenanceController.scheduleMaintenance);
router.patch('/:id/complete', maintenanceController.completeMaintenance);

export default router;
