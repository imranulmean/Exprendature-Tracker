import express from 'express';
import { addZakatItem, createNew, deleteZakatItem, getZakatItems, getZakatList } from '../controllers/zakat.controler.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/createNew', verifyToken, createNew);
router.post('/getZakatList', verifyToken, getZakatList);
router.post('/addZakatItem', verifyToken, addZakatItem);
router.post('/getZakatItems', verifyToken, getZakatItems);
router.post('/deleteZakatItem', verifyToken, deleteZakatItem);

export default router;