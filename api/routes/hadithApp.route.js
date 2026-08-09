import express from 'express';
import { checkActivation, createHadithBlog, deleteDevice, deleteHadithBlog, extendActivation, getAllDevice, getDevsPhone, getHadithBlogs, getSingleHadithBlog, updateHadithBlog } from '../controllers/hadithApp.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/checkActivation', checkActivation);
router.get('/getAllDevice', getAllDevice);
router.post('/extendActivation', extendActivation);
router.post('/deleteDevice', deleteDevice);
router.post('/getDevsPhone', getDevsPhone);

router.get('/getHadithBlogs', getHadithBlogs);
router.get('/getSingleHadithBlog/:id', getSingleHadithBlog);
router.post('/createHadithBlog', verifyToken, createHadithBlog);
router.post('/updateHadithBlog', verifyToken, updateHadithBlog);
router.post('/deleteHadithBlog', verifyToken, deleteHadithBlog);

export default router;