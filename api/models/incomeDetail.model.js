import mongoose from 'mongoose';

const incomeItemSchema = new mongoose.Schema(
  {
    incomeName: { type: String, required: true },
    amount: { type: Number, required: true }
  },
  { timestamps: true } 
);

const incomeDetailSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    year: { type: Number, required: true }, 
    monthName: { type: String, required: true }, 
    incomeList: [ incomeItemSchema ],
    total: { type: Number, required: true },
    totalCashInHand: { type: Number, default:0 },
    monthlyCashInHand: { type: Number, default:0 },
  }, { timestamps: true });
  
const IncomeDetail = mongoose.model('IncomeDetail', incomeDetailSchema);

export default IncomeDetail;
