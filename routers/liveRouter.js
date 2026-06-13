const express = require("express");
const route = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { createStream, getLiveStream, getStream, getStreams, getPastStreams, startStream, endStream, deleteStream } = require("../controllers/liveController");


route.post("/", createStream);
route.get("/", getLiveStream);
route.get("/past", getPastStreams);
route.get("/admin", authenticate, authorize("admin", "superAdmin"), getStreams);
route.patch("/:id/start", authenticate, authorize("admin", "superAdmin"), startStream);
route.patch("/:id/end", authenticate, authorize("admin", "superAdmin"), endStream);
route.delete("/:id", authenticate, authorize("admin", "superAdmin"), deleteStream);

module.exports = route;