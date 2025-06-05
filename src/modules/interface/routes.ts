// src/modules/users/routes.ts
import { Router } from 'express';
import { UserController } from './controllers/InterfaceController';

const router = Router();
const controller = new UserController();

router.post('/register', async (req, res) => {
  await controller.register(req, res);
});

router.post('/login', async (req, res) => {
  await controller.login(req, res);
});

export default router;