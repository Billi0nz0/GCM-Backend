const slugify = require("slugify");
const eventModel = require("../models/eventsModel");

exports.createEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const { title, description, date, time, imageUrl } = req.body;

        if (!title || !description || !date || !time) {
            return res.status(400).json({
                message: "Title, description, date and time are required"
            });
        }

        // generate base slug
        const baseSlug = slugify(title, {
            lower: true,
            strict: true
        });

        // make slug unique (important)
        const slug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

        const event = await eventModel.create({
            slug,
            title,
            description,
            date,
            time,
            imageUrl,
            user: userId
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });

    } catch (error) {
        console.error("Create Event Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getEvents = async (req, res) => {
    try {

        const events =
            await eventModel
                .find()
                .sort({ createdAt: -1 });

        res.status(200).json({
            count: events.length,
            events
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getEventById = async (req, res) => {
    try {

        const event = await eventModel.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({ event });

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.getEventBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const event = await eventModel.findOne({ slug })
            .populate("user", "fullName username");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json({ event });

    } catch (error) {
        console.error("Get Event Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { _id } = req.params;

        const event = await eventModel.findById(_id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
       
        // update fields
        if (req.body.title) {
            event.slug = `${slugify(req.body.title, {
                lower: true,
                strict: true
            })}-${Date.now().toString().slice(-5)}`;
        }

        Object.assign(event, req.body);

        await event.save();

        res.status(200).json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        console.error("Update Event Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.archiveEvent = async (req, res) => {
    try {

        const event = await eventModel.findById(req.params._id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        event.isArchived = true;

        await event.save();

        res.status(200).json({
            message: "Event archived successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }
};

exports.restoreEvent = async (req, res) => {
    try {

        const event = await eventModel.findById(req.params._id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        event.isArchived = false;

        await event.save();

        res.status(200).json({
            message: "Event restored successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { _id } = req.params;

        const event = await eventModel.findById(_id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        await event.deleteOne();

        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error("Delete Event Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};