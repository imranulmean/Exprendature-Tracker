import mongoose from 'mongoose';

const hadithAppActivationSchema = new mongoose.Schema({
    deviceId:{ type: String, unique: true ,required: true },
    mobileNo:{ type: String, default: '' },
    firstInstall:{ type: Date, required: true },
    trialStart:{ type: Date, required: true },
    trialEnd:{ type: Date, required: true },
    activated:{ type: Boolean, required: false },
    activation: {
        code: {
            type: String,
            default: ""
        },
        validDays: {
            type: Number,
            default: 0
        },
        expiresAt: {
            type: Date,
            default: null
        }
    }
},{ timestamps: true });

export const hadithAppActivation = mongoose.model('hadithAppActivation', hadithAppActivationSchema);
