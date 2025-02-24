import express from 'express';
import { getUsers } from '../controllers/adminApi.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/getUsers', verifyToken, getUsers);

export default router;