import express from 'express';
import { addExpenses, getCurrentMonthExpenses, getExpenses} from '../controllers/exp.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/addExpenses', verifyToken, addExpenses);
router.post('/getCurrentMonth', verifyToken, getCurrentMonthExpenses);
router.get('/getExpenses/:userId', verifyToken, getExpenses);

export default router;