const LiveStream = require("../models/liveModel");

exports.createStream = async (req, res) => {

    try {

        const stream = await LiveStream.create({
            title: req.body.title,
            description: req.body.description,
            liveUrl: req.body.liveUrl,
            thumbnail: req.body.thumbnail,
            platform: req.body.platform,

            isLive: false,
            isArchived: false,

            scheduledFor: req.body.scheduledFor || null
        });

        res.status(201).json(stream);

    } catch (err) {

        res.status(500).json({ message: err.message });
    }
};

exports.startStream = async (req, res) => {

    try {

        const stream = await LiveStream.findById(req.params.id);

        if (!stream) {
            return res.status(404).json({ message: "Not found" });
        }

        stream.isLive = true;
        stream.isArchived = false;

        await stream.save();

        res.json(stream);

    } catch (err) {

        res.status(500).json({ message: err.message });
    }
};

exports.endStream = async (req, res) => {

    try {

        const stream = await LiveStream.findById(req.params.id);

        if (!stream) {
            return res.status(404).json({ message: "Not found" });
        }

        stream.isLive = false;
        stream.isArchived = true;
        stream.endedAt = new Date();

        await stream.save();

        res.json(stream);

    } catch (err) {

        res.status(500).json({ message: err.message });
    }
};

exports.getStream = async (req, res) => {

    const stream = await LiveStream.findById(req.params.id);

    if (!stream) {
        return res.status(404).json({
            message: "Stream not found"
        });
    }

    res.json(stream);

};

exports.getStreams = async (req, res) => {

    const streams = await LiveStream
        .find()
        .sort({ createdAt: -1 });

    res.json({ streams });

};

exports.getLiveStream = async (req, res) => {

    try {
        const stream = await LiveStream.findOne({
            isLive: true
        }).sort({ createdAt: -1 });

        res.json(stream || null);

    } catch (err) {

        res.status(500).json({ message: err.message });
    }
};

exports.getPastStreams = async (req, res) => {

    try {

        const streams = await LiveStream.find({
            isArchived: true
        }).sort({ createdAt: -1 });

        res.json({ streams });

    } catch (err) {

        res.status(500).json({ message: err.message });
    }
};

exports.deleteStream = async (req, res) => {

    try {

        const stream = await LiveStream.findById(req.params.id);

        if (!stream) {
            return res.status(404).json({
                message: "Stream not found"
            });
        }

        await LiveStream.findByIdAndDelete(req.params.id);

        res.json({
            message: "Stream deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });
    }
};