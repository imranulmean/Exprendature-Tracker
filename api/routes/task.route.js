import express from 'express';
import { addTask, deleteTask, getTasks } from '../controllers/tasks.controller.js';

import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/addTask', verifyToken, addTask);
router.post('/getTasks', verifyToken, getTasks);
router.post('/deleteTask', verifyToken, deleteTask);

export default router;