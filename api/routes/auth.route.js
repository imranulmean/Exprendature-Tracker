import express from 'express';
import { google, signout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/google', google)
router.post('/signout', signout)

export default router;