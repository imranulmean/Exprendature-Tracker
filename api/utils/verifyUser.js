import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import User from '../models/user.model.js';
import HadithBlog from '../models/hadithBlog.model.js';

export const verifyToken = (req, res, next) => {
   const token = req.headers.authorization;
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {    
    if (err) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    const validUser= await User.findById({_id:user.id});
    if(!validUser){
      return next(errorHandler(401, 'Unauthorized'));
    }
    if(validUser.disabled){
      return next(errorHandler(401, 'Unauthorized'));
    }    
    req.user = validUser;
    next();
  });
};

export const checkIsAdmin = (req, res, next) =>{
  if(!req.user.isAdmin){
    return next(errorHandler(401, 'Unauthorized'));
  }
  next();
}

export const admin_or_owner = async(req, res, next) =>{
  if(req.user.isAdmin){
    return next();
  }
  else{
    const blogId= req.body._id || req.body.blogId;
    const existingBlog=await HadithBlog.findById({_id:blogId});
    if (!existingBlog) {
      return next(errorHandler(404, 'No Blog Found'));
    }    
    if(existingBlog.userId === req.user._id.toString()){
      return next();
    }
    else{
      return next(errorHandler(401, 'You Are not Allowed'));
    }
  }
  
}