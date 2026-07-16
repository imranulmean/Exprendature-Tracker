import mongoose from 'mongoose';

const hadithAppActivationSchema = new mongoose.Schema({
    deviceId:{ type: String, unique: true ,required: true, lowercase: true, trim: true },
    firstInstall:{ type: Date, required: true },
    trialStart:{ type: Date, required: true },
    trialEnd:{ type: Date, required: true },
    activated:{ type: Number, required: false }
},{ timestamps: true });

export const hadithAppActivation = mongoose.model('hadithAppActivation', hadithAppActivationSchema);
