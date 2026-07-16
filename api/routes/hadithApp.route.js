import express from 'express';
import { checkActivation, extendActivation, getAllDevice } from '../controllers/hadithApp.controller.js';

const router = express.Router();
router.get('/checkActivation/:deviceId', checkActivation);
router.get('/getAllDevice', getAllDevice);
router.post('/extendActivation', extendActivation);

export default router;