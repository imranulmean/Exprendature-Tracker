import IncomeDetail from '../models/incomeDetail.model.js'; 
import ExpDetail from '../models/expDetail.model.js';
import TotalCashDetail from '../models/totalCash.model.js';

export const addIncome = async (req, res) => {

    const { userId, year, monthName, incomeList, total } = req.body;
    const { _id, isAdmin } = req.user;
    
    if( _id.toString() !== userId){      
      return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised"});
    }
    
    try {
      
      const existingIncomeDetail = await IncomeDetail.findOne({ userId, year, monthName });
      const existingExpDetail = await ExpDetail.findOne({ userId, year, monthName });
      const existingTotalCashDetail= await TotalCashDetail.findOne({userId});
      let existingExpTotal=0;
      let existingTotalCash=0;
      let prevTotalMonthCash=0;
        //////////////// Checking current month exp detail //////////
      if(existingTotalCashDetail){
        existingTotalCash=existingTotalCashDetail.totalCash;        
      }

      if(existingExpDetail){
        existingExpTotal=existingExpDetail.total;
      }

      if (existingIncomeDetail) {
        
        existingIncomeDetail.incomeList=incomeList
        existingIncomeDetail.total = total;
        prevTotalMonthCash= existingIncomeDetail.monthlyCashInHand;        
        existingIncomeDetail.monthlyCashInHand = total - existingExpTotal;
        let updateTotalCashDetail=0;
        if(existingTotalCashDetail){
          updateTotalCashDetail= existingTotalCash - prevTotalMonthCash;
          updateTotalCashDetail= updateTotalCashDetail + existingIncomeDetail.monthlyCashInHand;
          existingTotalCashDetail.totalCash=updateTotalCashDetail;
          await existingTotalCashDetail.save();
        }
        existingIncomeDetail.totalCashInHand= existingTotalCashDetail.totalCash;
        await existingIncomeDetail.save(); 
        res.status(200).json(existingIncomeDetail);
      } 
      else {
        
        let newMonthlyCashInHand= total - existingExpTotal
        if(existingTotalCashDetail){
          let updateTotalCashDetail= existingTotalCash - prevTotalMonthCash;          
          updateTotalCashDetail= updateTotalCashDetail + newMonthlyCashInHand;
          existingTotalCashDetail.totalCash=updateTotalCashDetail;
          await existingTotalCashDetail.save();
        }        
        let newTotalCashInHand= existingTotalCashDetail.totalCash;
        const newIncomeDetail = new IncomeDetail({
          userId,
          year,
          monthName,
          incomeList,
          total,
          monthlyCashInHand:newMonthlyCashInHand,
          totalCashInHand:newTotalCashInHand
        });
        await newIncomeDetail.save(); 
        res.status(201).json(newIncomeDetail);        
      }

    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

export const getCurrentMonthIncome = async (req, res) => {
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
        let existingIncomeDetail = await IncomeDetail.find(query);
        if(existingIncomeDetail.length>0){
          existingIncomeDetail=existingIncomeDetail[0].toObject();
        }
        else{
          existingIncomeDetail={};
        }
        const overAllTotalCash= await TotalCashDetail.findOne({userId});
        if(overAllTotalCash){
          existingIncomeDetail['overAllTotalCash']=overAllTotalCash;
        }
        
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



export const addTotalCash = async (req, res) => {

  const { userId, totalCash } = req.body;
  const { _id, isAdmin } = req.user;
  
  if( _id.toString() !== userId){      
    return res.status(401).json({ success: false, statusCode:401, message: "Unauthorized: Unauthorised"});
  }
  
  try {
    
    const existingTotalCash = await TotalCashDetail.findOne({ userId});

    if (existingTotalCash) {
      existingTotalCash.totalCash=totalCash

      await existingTotalCash.save(); 
      res.status(200).json(existingTotalCash);
    } 
    else {
      const newTotalCash = new TotalCashDetail({
        userId,
        totalCash
      });

      await newTotalCash.save(); 
      res.status(201).json(newTotalCash);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};