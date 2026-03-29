import mongoose from 'mongoose';

const hadithSchema = new mongoose.Schema({
    arabicText: [String],
    title: String,
    banglaText: [String],
    bookName: String
});


const englishHadithSchema = new mongoose.Schema({
    englishTitle: [String],
    englishText: String,
    bookName: String
});


export const Hadith = mongoose.model('Hadith', hadithSchema);
export const EnglishHadith = mongoose.model('EnglishHadith', englishHadithSchema);