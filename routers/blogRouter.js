const express = require("express");
const route = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { createBlog, getBlogBySlug, getBlogs, updateBlog, deleteBlog } = require("../controllers/blogController");

route.get("/", getBlogs);              // pagination
route.get("/:slug", getBlogBySlug);   // SEO URL
route.post("/", authenticate, createBlog);
route.put("/:_id", authenticate, updateBlog);
route.delete("/:_id", authenticate, deleteBlog);

module.exports = route;