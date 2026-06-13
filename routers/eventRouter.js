const express = require("express");
const route = express.Router();
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { getEvents, getEventById, createEvent, archiveEvent, restoreEvent, getEventBySlug, updateEvent, deleteEvent } = require("../controllers/eventController");



route.post("/", authenticate, createEvent);
route.get("/", getEvents);
route.get("/:slug", getEventBySlug);
route.get("/events/:id", getEventById);
route.patch("/archive/:_id", authenticate, authorize("admin", "superAdmin"), archiveEvent);
route.patch("/restore/:_id", authenticate, authorize("admin", "superAdmin"), restoreEvent);
route.put("/:_id", authenticate, updateEvent);
route.delete("/:_id", authenticate, deleteEvent);

module.exports = route;