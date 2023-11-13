import express from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from '../controllers/task.controller';
import { checkAuth } from '../middlewares/check-auth.middleware';

const router = express.Router();

router.get('', getTasks);
router.post('', checkAuth, createTask);

router.get('/:id', getTask);
router.put('/:id', checkAuth, updateTask);
router.delete('/:id', checkAuth, deleteTask);

export { router as taskRoutes };
