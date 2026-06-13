const express = require("express");
const route = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {getProfile, getUsers, changePassword, updateProfile, deleteProfile, toggleBanUser} = require("../controllers/userController");


route.get("/all", authenticate, authorize("superAdmin"), getUsers)
route.get("/profile/:_id", authenticate, getProfile);
route.put("/profile/:_id", authenticate, updateProfile);
route.put("/changePassword", authenticate, changePassword);
route.patch("/profile/:_id/ban", authenticate, authorize("superAdmin"), toggleBanUser);
route.delete("/profile/:_id", authenticate, authorize("superAdmin"), deleteProfile);

module.exports = route;