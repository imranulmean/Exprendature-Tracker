import mongoose from 'mongoose';

const yearlyZakatSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    year: { type: Number, required: true }, 
    total: { type: Number, required: true },
    paid:{ type: Number, default:0, required: true, },
  }, { timestamps: true });
  
const YearlyZakat = mongoose.model('YearlyZakat', yearlyZakatSchema);

export default YearlyZakat;
