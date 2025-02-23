import express from 'express';
import { addExpenses, getCurrentMonthExpenses, getExpenses} from '../controllers/exp.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/addExpenses', addExpenses);
router.post('/getCurrentMonth',  getCurrentMonthExpenses);
router.get('/getExpenses/:userId',  getExpenses);

export default router;