import { Router } from 'express';
import { equipmentController } from '../controllers/equipmentController.ts';

const router = Router();

// Rutas de Inventario de Equipamiento Táctico y Comunicaciones
router.get('/', equipmentController.getAllEquipment);
router.get('/stats', equipmentController.getInventoryStats);
router.get('/alerts/comsec', equipmentController.getComsecAlerts);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', equipmentController.createEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

export default router;
