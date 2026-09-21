import { Router } from 'express';
import { authController } from '../controllers/authController.ts';

const router = Router();

router.post('/login', authController.login);
router.get('/personnel', authController.getPersonnel);

export default router;
