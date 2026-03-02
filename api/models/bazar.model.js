import mongoose from 'mongoose';

const bazarSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    purpose: { type: String, required: true }, 
    paid:{ type: Number, default:0, required: true, },
  }, { timestamps: true });
  
const Bazar = mongoose.model('bazarItem', bazarSchema);

export default Bazar;
