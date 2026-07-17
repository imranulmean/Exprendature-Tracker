import express from 'express';
import { checkActivation, deleteDevice, extendActivation, getAllDevice, getDevsPhone } from '../controllers/hadithApp.controller.js';

const router = express.Router();
router.post('/checkActivation', checkActivation);
router.get('/getAllDevice', getAllDevice);
router.post('/extendActivation', extendActivation);
router.post('/deleteDevice', deleteDevice);
router.post('/getDevsPhone', getDevsPhone);


export default router;