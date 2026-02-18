import mongoose from 'mongoose';

const zakatItemSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    yearlyZakatId: { type: String, required: true }, 
    purpose: { type: String, required: true }, 
    paid:{ type: Number, default:0, required: true, },
  }, { timestamps: true });
  
const ZakatItem = mongoose.model('zakatItem', zakatItemSchema);

export default ZakatItem;
