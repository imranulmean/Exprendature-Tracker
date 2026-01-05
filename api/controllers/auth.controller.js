import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import TotalCashDetail from '../models/totalCash.model.js';

export const google = async (req, res, next) => {
    const { email, displayName, googlePhotoUrl } = req.body;
    let userId="";
    try {
      const user = await User.findOne({ email });
      if (user) {
        userId=user._id;
        const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET
        );
        const { password, isAdmin, ...rest } = user._doc;
        if(isAdmin===true){
          rest['isAdmin']=isAdmin;
        }

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
            secure: true,  
            sameSite: "None",
            sameSite: "Lax",
          }).json(rest);
      } 
      else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          displayName,
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        await newUser.save();
        userId=newUser._id;
        const token = jwt.sign(
          { id: newUser._id },
          process.env.JWT_SECRET
        );
        const { password, isAdmin, ...rest } = newUser._doc;
        res.status(200).cookie('access_token', token, {httpOnly: true,}).json(rest);
      }
      const existingTotalCash = await TotalCashDetail.findOne({ userId});
      if(!existingTotalCash){
        const newTotalCash = new TotalCashDetail({
          userId,
          totalCash:0
        });
        await newTotalCash.save();
      }
    } catch (error) {
      next(error);
    }
  };

  export const signout = (req, res, next) => {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
      next(error);
    }
  };