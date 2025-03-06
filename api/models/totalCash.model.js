import mongoose from "mongoose";

const totalCashSchema= new mongoose.Schema({
    userId:{ type: String, required: true },
    totalCash: { type: Number, default:0 },
})

const TotalCashDetail= mongoose.model('TotalCash', totalCashSchema);
export default TotalCashDetail;