import express from 'express';
import { checkActivation, deleteDevice, extendActivation, getAllDevice } from '../controllers/hadithApp.controller.js';

const router = express.Router();
router.get('/checkActivation/:deviceId', checkActivation);
router.get('/getAllDevice', getAllDevice);
router.post('/extendActivation', extendActivation);
router.post('/deleteDevice', deleteDevice);


export default router;