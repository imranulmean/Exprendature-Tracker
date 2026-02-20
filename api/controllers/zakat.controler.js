import YearlyZakat from '../models/yearlyZakat.model.js';
import ZakatItem from '../models/zakatItem.model.js';

export const createNew = async (req, res) => {

    const { userId, year, total } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised"});
    }
    
    try {      
      const existingYearlyZakat = await YearlyZakat.findOne({ userId, year });

      if(existingYearlyZakat){
        existingYearlyZakat.total= total;
        await existingYearlyZakat.save();
        return res.status(201).json({ success: true, statusCode:201, message: "Updated Successfully"});
      }
      const newYearlyZakat = new YearlyZakat({ userId, year, total });
      await newYearlyZakat.save(); 
      res.status(201).json({ success: true, statusCode:201, message: "Inserter Successfully", newYearlyZakat});   

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

export const getZakatList = async (req, res) => {

    const { userId } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorised"});
    }
    
    try {      
      const yearlyZakats = await YearlyZakat.find({ userId });

      res.status(201).json({ success: true, statusCode:201, message: yearlyZakats});   

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

export const addZakatItem = async (req, res) =>{

    const { userId, yearlyZakatId, purpose, paid  } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorised"});
    }
    
    try {      
      const existingYearlyZakat = await YearlyZakat.findById({ _id:yearlyZakatId });
        if(!existingYearlyZakat){
                return res.status(401).json({ success: false, statusCode:401, message: "No Option found"});
        }
        const newZakatItem = new ZakatItem({ userId, yearlyZakatId, purpose, paid });
        await newZakatItem.save(); 

        existingYearlyZakat.paid += Number(paid);
        await existingYearlyZakat.save();

        res.status(201).json({ success: true, statusCode:201, message: "Inserter Successfully", newZakatItem});

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }    
    
}

export const getZakatItems = async (req, res) =>{

    const { userId, yearlyZakatId } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorised"});
    }
    
    try {      
        const zakatItems = await ZakatItem.find({ yearlyZakatId });
        res.status(201).json({ success: true, statusCode:201, message: zakatItems});

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }    
    
}

export const deleteZakatItem = async (req, res) =>{

    const { userId, zakatItemId, yearlyZakatId } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorised"});
    }
    
    try {      
        const itemToDelete = await ZakatItem.findById(zakatItemId);
        if (!itemToDelete) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        if (itemToDelete.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You do not own this record" });
        }

        await YearlyZakat.findByIdAndUpdate(itemToDelete.yearlyZakatId, {
            $inc: { paid: -itemToDelete.paid }
        });

        await ZakatItem.findByIdAndDelete(zakatItemId);        
        
        res.status(200).json({ success: true, message: "Deleted successfully and balance updated" });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }    
    
}
