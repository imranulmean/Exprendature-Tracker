import express from 'express';
import { createHadithBlogUser, deleteHadithBlogUser, google, signout, updateHadithBlogUser } from '../controllers/auth.controller.js';
import { checkIsAdmin, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/google', google)
router.post('/signout', signout)

router.post('/createHadithBlogUser',verifyToken, checkIsAdmin, createHadithBlogUser)
router.post('/updateHadithBlogUser',verifyToken, checkIsAdmin, updateHadithBlogUser)
router.post('/deleteHadithBlogUser',verifyToken, checkIsAdmin, deleteHadithBlogUser);


export default router;