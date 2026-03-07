import Bazar from '../models/bazar.model.js';

export const addBazarItem = async (req, res) =>{

    const { userId, purpose, paid  } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized"});
    }
    
    try {      

        const newBazarItem = new Bazar({ userId, purpose, paid });
        await newBazarItem.save(); 

        res.status(201).json({ success: true, statusCode:201, message: "Inserter Successfully", newBazarItem});

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }    
    
}

export const getBazarItems = async (req, res) =>{

    const { userId } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized"});
    }
    
    try {      
        const bazarItems = await Bazar.find({ userId }).sort({'createdAt':-1});
        res.status(201).json({ success: true, statusCode:201, message: bazarItems});

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }    
    
}

export const deleteBazarItem = async (req, res) =>{

    const { userId, bazarItemId } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized"});
    }
    
    try {      
        const itemToDelete = await Bazar.findById(bazarItemId);
        if (!itemToDelete) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        if (itemToDelete.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You do not own this record" });
        }

        await Bazar.findByIdAndDelete(bazarItemId);        
        
        res.status(200).json({ success: true, message: "Deleted successfully and balance updated" });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }    
    
}
