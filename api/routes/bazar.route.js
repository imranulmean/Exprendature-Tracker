import express from 'express';
import { addBazarItem, getBazarItems, deleteBazarItem } from '../controllers/bazar.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/addBazarItem', verifyToken, addBazarItem);
router.post('/getBazarItems', verifyToken, getBazarItems);
router.post('/deleteBazarItem', verifyToken, deleteBazarItem);

export default router;