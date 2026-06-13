const mongoose = require('mongoose');
const userIdGen = require('../middleware/userIdGen');

const eventSchema = new mongoose.Schema({
    eventId: {type: String, default: userIdGen},
    slug: {type: String, required: true, unique: true, index: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String, required: true},
    imageUrl: {type: String, default: ""},
    isArchived: { type: Boolean, default: false },
    createdAt: {type: Date, default: Date.now},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {timestamps: true}

)

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;