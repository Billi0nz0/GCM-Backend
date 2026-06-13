const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");
const slugify = require("slugify");

exports.createBlog = async (req, res) => {
    try {
        const { title, text, imageUrl, description, content, prayerPoints } = req.body;
        const userId = req.user._id;

        if (!title || !text|| !description || !content || !prayerPoints) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const slug = `${slugify(title, {
            lower: true,
            strict: true
        })}-${Date.now()}`;

        const blog = await blogModel.create({
            title,
            slug,
            text,
            imageUrl,
            description,
            content,
            prayerPoints,
            author: userId,
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        console.error("Create Blog Error", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        const blogs = await blogModel
            .find()
            .populate("author", "fullName username profilePhoto")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await blogModel.countDocuments();

        res.status(200).json({
            totalBlogs,
            currentPage: page,
            totalPages: Math.ceil(totalBlogs / limit),
            blogs
        });

    } catch (error) {
        console.error("Cannot get blogs", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;

        const blog = await blogModel
            .findOne({ slug })
            .populate("author", "fullName username profilePhoto");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ blog });

    } catch (error) {
        console.error("Cannot get blog", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blogId = req.params._id;
        const blog = await blogModel.findById(blogId).populate("author", "fullName username profilePhoto");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ blog });
    } catch (error) {
        console.error("Cannot get blog", error.message);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params._id;
        const blog = await blogModel.findByIdAndDelete(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Cannot delete blog", error.message);
        res.status(500).json({ message: "Server error, please try again later" });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params._id;

        const updateData = { ...req.body };

        // regenerate slug if title is updated
        if (updateData.title) {
            updateData.slug = slugify(updateData.title, {
                lower: true,
                strict: true
            });
        }

        const blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });

    } catch (error) {
        console.error("Cannot update blog", error.message);
        res.status(500).json({ message: "Server error" });
    }
};