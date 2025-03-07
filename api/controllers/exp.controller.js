import ExpDetail from '../models/expDetail.model.js'; 
import IncomeDetail from '../models/incomeDetail.model.js';
import TotalCashDetail from '../models/totalCash.model.js';

export const addExpenses = async (req, res) => {

    const { userId, year, monthName, expList, total } = req.body;
   
    const { _id, isAdmin } = req.user;
    
    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised"});
    }
    
    try {
      const existingExpDetail = await ExpDetail.findOne({ userId, year, monthName });
      const existingIncomeDetail = await IncomeDetail.findOne({ userId, year, monthName });
      const existingTotalCashDetail= await TotalCashDetail.findOne({userId});
      let existingTotalCash=0;
      let prevExpTotal=0;
      if(existingTotalCashDetail){
        existingTotalCash=existingTotalCashDetail.totalCash;
      }

      if (existingExpDetail) {
        prevExpTotal = existingExpDetail.total;
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

      //////// now change the income table data ///////
      if(existingIncomeDetail){
        let prevMonthlyCashInHand=existingIncomeDetail.monthlyCashInHand + prevExpTotal;
        prevMonthlyCashInHand= prevMonthlyCashInHand - total
        existingIncomeDetail.monthlyCashInHand=prevMonthlyCashInHand;

        let prevTotalCashInHand=existingIncomeDetail.totalCashInHand + prevExpTotal;
        prevTotalCashInHand=prevTotalCashInHand - total;
        existingIncomeDetail.totalCashInHand=prevTotalCashInHand

        await existingIncomeDetail.save();              
      }

      if(existingTotalCashDetail){
        let prevOverallCash= existingTotalCashDetail.totalCash + prevExpTotal;
        prevOverallCash = prevOverallCash - total
        existingTotalCashDetail.totalCash = prevOverallCash;
        await existingTotalCashDetail.save();
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