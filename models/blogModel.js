const mongoose = require('mongoose');
const userIdGen = require('../middleware/userIdGen');

const blogSchema = new mongoose.Schema({
    blogId: {type: String, default: userIdGen},
    slug: {type: String, required: true, unique: true, index: true},
    imageUrl: {type: String, default: ""},
    title: {type: String, required: true},
    text: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    description: {type: String, required: true},
    content: {type: String, required: true},
    prayerPoints: {type: String },
    createdAt: {type: Date, default: Date.now},
}, {timestamps: true}

)

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;