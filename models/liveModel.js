const mongoose = require("mongoose");

const liveSchema = new mongoose.Schema({
    title: String,
    description: String,
    liveUrl: String,
    thumbnail: String,

    platform: {
        type: String,
        enum: ["facebook", "youtube"],
        default: "facebook"
    },

    isLive: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },

    scheduledFor: Date,
    endedAt: Date
}, { timestamps: true });

const LiveStream = mongoose.model("LiveStream", liveSchema);

module.exports = LiveStream