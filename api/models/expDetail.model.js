import mongoose from 'mongoose';

const expDetailSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    year: { type: Number, required: true }, 
    monthName: { type: String, required: true }, 
    expList: [
      {
        expName: { type: String, required: true },
        amount: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
  }, { timestamps: true });
  
const ExpDetail = mongoose.model('ExpDetail', expDetailSchema);

export default ExpDetail;
