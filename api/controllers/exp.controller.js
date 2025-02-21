import ExpDetail from '../models/expDetail.model.js'; // Importing the model

export const addExpenses = async (req, res) => {
    const { userId, year, monthName, expList, total } = req.body;
  
    try {
      // Check if the document already exists for the given userId, year, and monthName
      const existingExpDetail = await ExpDetail.findOne({ userId, year, monthName });
  
      if (existingExpDetail) {
        // If the record exists, update it with the new expList and total
        existingExpDetail.expList = expList;
        existingExpDetail.total = total;
  
        await existingExpDetail.save(); // Save the updated record
        res.status(200).json(existingExpDetail); // Respond with the updated document
      } else {
        // If no record exists, create a new one
        const newExpDetail = new ExpDetail({
          userId,
          year,
          monthName,
          expList,
          total
        });
  
        await newExpDetail.save(); // Save the new document
        res.status(201).json(newExpDetail); // Respond with the newly created document
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

export const getCurrentMonthExpenses = async (req, res) => {

    const { userId, year, monthName } = req.body;
    if(!userId || userId===''){
        return res.status(401).json({ success: false, message: "Unauthorized: userId is required" });
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

    const {userId}=req.params;
    try {
        const existingExpDetail = await ExpDetail.find({ userId});
        res.status(200).json(existingExpDetail);
    } 
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}; 