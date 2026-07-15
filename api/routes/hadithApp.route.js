import express from 'express';
import { checkActivation } from '../controllers/hadithApp.controller.js';

const router = express.Router();
router.get('/checkActivation/:deviceId', checkActivation);

export default router;