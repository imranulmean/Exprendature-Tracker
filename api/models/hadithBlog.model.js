import mongoose from 'mongoose';

const hadithBlogSchema = new mongoose.Schema({
        userId: String,
        title: String,
        shortDesc: String,
        tags: [String],
        details: String
    },
    { timestamps: true }
);

const HadithBlog = mongoose.model('HadithBlog', hadithBlogSchema);
export default HadithBlog;