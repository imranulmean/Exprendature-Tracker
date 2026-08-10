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
        rest['authorization']= token;
        res.status(200).json(rest);

      } 
      // else {
      //   const generatedPassword =
      //     Math.random().toString(36).slice(-8) +
      //     Math.random().toString(36).slice(-8);
      //   const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      //   const newUser = new User({
      //     displayName,
      //     email,
      //     password: hashedPassword,
      //     profilePicture: googlePhotoUrl,
      //   });
      //   await newUser.save();
      //   userId=newUser._id;
      //   const token = jwt.sign(
      //     { id: newUser._id },
      //     process.env.JWT_SECRET
      //   );
      //   const { password, isAdmin, ...rest } = newUser._doc;
      //   res.status(200).cookie('access_token', token, {httpOnly: true,}).json(rest);
      // }
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

  export const createHadithBlogUser = async(req, res)=>{

    try {
      const {email, password, displayName} = req.body;
      const hashedPass= bcryptjs.hashSync(password, 10);
      const user = await User.findOne({ email });
      if(user){
          return res.json({success: true, message: "User Already Exists"});
      }
      const userObj= { email, password: hashedPass, displayName};
      const newUser = new User(userObj);
      const userRes= await newUser.save();
      res.json({success: true, message: "User Created", userRes});
    } catch (error) {
      res.json({success: false, message: error.message});
    }
  }

  export const updateHadithBlogUser = async(req, res)=>{

    try {
      const {userId, updatedPass} = req.body;
      const updatedField={};
      if(updatedPass) updatedField.password=bcryptjs.hashSync(updatedPass, 10)
      const validUser = await User.findByIdAndUpdate( 
          {_id:userId}, 
          {$set:updatedField}, 
          { new:true } 
      ).select('-password');
      if(!validUser){
          return res.json({success: false, message: "User Not Found"});
      }
      res.json({success: true, message: "User Update Success",validUser});
    } catch (error) {
      res.json({success: false, message: error.message});
    }
  }  

  export const deleteHadithBlogUser = async(req, res)=>{

    try {
      const {userId} = req.body;

      const validUser = await User.findByIdAndDelete({_id:userId});
      res.json({success: true, message: "User Delete Success"});
    } catch (error) {
      res.json({success: false, message: error.message});
    }
  }    

  export const hadithBlogLogin = async(req, res)=>{

    try {
      const {email, password} = req.body;
      const validUser = await User.findOne({ email });
      if(!validUser){
          return res.json({success: false, message: "User Not Found"});
      }

      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
          return res.json({success: false, message: "Userid or Password is wrong"});
        }   

      const token = jwt.sign({ id: validUser._id, role: validUser.role},
                    process.env.JWT_SECRET,
                    { expiresIn:"1h" }
      );

      const { password: pass, ...rest } = validUser._doc;
      res.json({success: true, message: "User Login Success", rest, token});
    } catch (error) {
      res.json({success: false, message: error.message});
    }
  }

  export const hadithBlogValidateUser = async(req, res)=>{

    try {
      res.json({success: true, message: "User Validate Success"});
    } catch (error) {
      console.log('hittin')
      res.json({success: false, message: error.message});
    }
  }  