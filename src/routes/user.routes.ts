import express from 'express';
import { createUser, loginUser } from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);

export { router as userRoutes };
