const express = require("express");
const route = express.Router();
const {register, getMe, getProfile, login, logout, forgotPassword, resetPassword} = require("../controllers/userController");
const authenticate = require('../middleware/authenticate');
const rateLimit = require("express-rate-limit");
const authorize = require("../middleware/authorize");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many request, please try again"
});



route.post("/register", authorize("superAdmin"), limiter, register);
route.post("/login", limiter, login);
route.get("/", authorize("admin", "superAdmin"), getProfile )
route.get("/me", authenticate, getMe);
route.post("/logout", logout);
route.post("/forgotPassword", forgotPassword);
route.post("/resetPassword/:token", resetPassword);

module.exports = route;
