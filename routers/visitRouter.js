const express = require("express");
const route = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getWeeklyStats, trackVisit  } = require("../controllers/visitController");

route.get("/weekly", getWeeklyStats);              
route.post("/:id", trackVisit);


module.exports = route;