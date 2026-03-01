import Tasks from '../models/tasks.model.js';

export const getTasks = async (req, res) => {

    const { userId } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized"});
    }
    
    try {      
      const tasks = await Tasks.find({ userId });

      res.status(201).json({ success: true, statusCode:201, message: tasks});   

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

export const addTask = async (req, res) =>{

    const { userId, purpose  } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized"});
    }
    
    try {      

        const newTask = new Tasks({ userId, purpose });
        await newTask.save(); 

        res.status(201).json({ success: true, statusCode:201, message: "Inserter Successfully", newTask});

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }    
    
}

export const deleteTask = async (req, res) =>{

    const { userId, taskId } = req.body;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized"});
    }
    
    try {      
        const itemToDelete = await Tasks.findById(taskId);
        if (!itemToDelete) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        if (itemToDelete.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "You do not own this record" });
        }

        await Tasks.findByIdAndDelete(taskId);        
        
        res.status(200).json({ success: true, message: "Deleted successfully" });

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }    
    
}
