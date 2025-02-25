import ExpDetail from '../models/expDetail.model.js'; // Importing the model

export const addExpenses = async (req, res) => {

    const { userId, year, monthName, expList, total } = req.body;
   
    const { _id, isAdmin } = req.user;
    
    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised"});
    }
    
    try {
      const existingExpDetail = await ExpDetail.findOne({ userId, year, monthName });
      
      if (existingExpDetail) {

        existingExpDetail.expList=expList
        existingExpDetail.total = total;
  
        await existingExpDetail.save(); 
        res.status(200).json(existingExpDetail);
      } 
      else {

        const newExpDetail = new ExpDetail({
          userId,
          year,
          monthName,
          expList,
          total
        });
  
        await newExpDetail.save(); 
        res.status(201).json(newExpDetail);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

export const getCurrentMonthExpenses = async (req, res) => {

    const { userId, year, monthName } = req.body;
    if(!userId || userId===''){
        return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised"});
    }

    const { _id, isAdmin } = req.user;
    
    if( _id.toString() !== userId && !isAdmin){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised"});
    }

    try {
        const query= {
            userId,
            ...(year!=='' && {year}),
            ...(monthName!=='' && {monthName}),
        }
        const existingExpDetail = await ExpDetail.find(query);
        res.status(200).json(existingExpDetail);
    } 
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};  

export const getExpenses = async (req, res) => {

    const { userId }=req.params;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId && !isAdmin){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised" });
    }

    try {
        const existingExpDetail = await ExpDetail.find({ userId}).sort({createdAt:-1});
        res.status(200).json(existingExpDetail);
    } 
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}; 