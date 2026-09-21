import { Router } from 'express';
import { custodyController } from '../controllers/custodyController.ts';

const router = Router();

router.get('/', custodyController.getAllCustodies);
router.post('/assign', custodyController.assignCustody);
router.patch('/:id/return', custodyController.returnCustody);

export default router;
