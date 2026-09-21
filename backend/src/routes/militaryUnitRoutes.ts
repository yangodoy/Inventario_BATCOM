import { Router } from 'express';
import { militaryUnitController } from '../controllers/militaryUnitController.ts';

const router = Router();

router.get('/', militaryUnitController.getAllUnits);
router.get('/:id', militaryUnitController.getUnitById);

export default router;
