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
        existingIncomeDetail.monthlyCashInHand = total - existingExpTotal;
        console.log(`existingExpTotal: ${existingExpTotal}, existingTotalCash:${existingTotalCash}`)
        existingIncomeDetail.totalCashInHand= existingTotalCash - existingExpTotal;
        await existingIncomeDetail.save(); 
        res.status(200).json(existingIncomeDetail);
        if(existingTotalCashDetail){
          let updateTotalCashDetail= existingTotalCash + existingIncomeDetail.monthlyCashInHand;
          existingTotalCashDetail.totalCash=updateTotalCashDetail;
          await existingTotalCashDetail.save();
        }
      } 
      else {
        ////// Add the Income Total after minus exp total if there
        let newMonthlyCashInHand= total - existingExpTotal
        let newTotalCashInHand= existingTotalCash - existingExpTotal;
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
        if(existingTotalCashDetail){
          let updateTotalCashDetail= existingTotalCash + newMonthlyCashInHand;
          existingTotalCashDetail.totalCash=updateTotalCashDetail;
          await existingTotalCashDetail.save();
        }        
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
        existingIncomeDetail=existingIncomeDetail[0].toObject();
        const overAllTotalCash= await TotalCashDetail.findOne({userId});
        existingIncomeDetail['overAllTotalCash']=overAllTotalCash;
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