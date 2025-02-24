import User from '../models/user.model.js'; // Importing the model

export const getUsers = async (req, res) => {
  
    const { _id, isAdmin } = req.user;
    
    if(!isAdmin){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised" });
    }
    
    try {
        const users= await User.find();
        res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
