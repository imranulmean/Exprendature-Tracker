import mongoose from 'mongoose';

const hadithSchema = new mongoose.Schema({
    arabicText: [String],
    title: String,
    banglaText: [String],
    bookName: String
});

export default mongoose.model('Hadith', hadithSchema);