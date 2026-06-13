const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
    visitorId: String,
    pageId: String,
    date: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Visit", visitSchema);