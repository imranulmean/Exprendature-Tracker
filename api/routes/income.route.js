import express from 'express';
import { addIncome, getCurrentMonthIncome, getIncome} from '../controllers/income.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/addIncome', verifyToken, addIncome);
router.post('/getCurrentMonth', verifyToken, getCurrentMonthIncome);
router.get('/getIncome/:userId', verifyToken,  getIncome);

export default router;