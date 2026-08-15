import express from 'express';
import { checkActivation, createHadithBlog, deleteDevice, deleteHadithBlog, extendActivation, getAllDevice, getDevsPhone, getHadithBlogs, getSingleHadithBlog, getUniqueHadithBlogTags, updateHadithBlog } from '../controllers/hadithApp.controller.js';
import { admin_or_owner, verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/checkActivation', checkActivation);
router.get('/getAllDevice', getAllDevice);
router.post('/extendActivation', extendActivation);
router.post('/deleteDevice', deleteDevice);
router.post('/getDevsPhone', getDevsPhone);

router.get('/getHadithBlogs', getHadithBlogs);
router.get('/getSingleHadithBlog/:id', getSingleHadithBlog);
router.post('/createHadithBlog', verifyToken, createHadithBlog);
router.post('/updateHadithBlog', verifyToken, admin_or_owner, updateHadithBlog);
router.post('/deleteHadithBlog', verifyToken, admin_or_owner, deleteHadithBlog);

router.get("/getUniqueHadithBlogTags", getUniqueHadithBlogTags);

export default router;