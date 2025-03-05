import IncomeDetail from '../models/incomeDetail.model.js'; 
import ExpDetail from '../models/expDetail.model.js';

export const addIncome = async (req, res) => {

    const { userId, year, monthName, incomeList, total } = req.body;
    const { _id, isAdmin } = req.user;
    
    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised"});
    }
    
    try {
      
      const existingIncomeDetail = await IncomeDetail.findOne({ userId, year, monthName });
      const existingExpDetail = await ExpDetail.findOne({ userId, year, monthName });
      let existingExpTotal=0;
        //////////////// Checking current month exp detail //////////
      if(existingExpDetail){
        existingExpTotal=existingExpDetail.total;
      }
      if (existingIncomeDetail) {
        existingIncomeDetail.incomeList=incomeList
        existingIncomeDetail.total = total - existingExpTotal;
  
        await existingIncomeDetail.save(); 
        res.status(200).json(existingIncomeDetail);
      } 
      else {
        ////// Add the Income Total after minus exp total if there
        let newTotal= total - existingExpTotal;
        const newIncomeDetail = new IncomeDetail({
          userId,
          year,
          monthName,
          incomeList,
          total: newTotal
        });
  
        await newIncomeDetail.save(); 
        res.status(201).json(newIncomeDetail);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

export const getCurrentMonthIncome = async (req, res) => {

  console.log(req.body)
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
        const existingIncomeDetail = await IncomeDetail.find(query);
        console.log(existingIncomeDetail);
        res.status(200).json(existingIncomeDetail);
    } 
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};  

export const getIncome = async (req, res) => {

    const { userId }=req.params;
    const { _id, isAdmin } = req.user;

    if( _id.toString() !== userId && !isAdmin){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised" });
    }

    try {
        const existingIncomeDetail = await IncomeDetail.find({ userId}).sort({createdAt:-1});
        res.status(200).json(existingIncomeDetail);
    } 
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}; 