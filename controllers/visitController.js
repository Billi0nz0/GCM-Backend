const Visit = require("../models/visitModel");
const { v4: uuidv4 } = require("uuid");

exports.trackVisit = async (req, res) => {

    try {

        let visitorId = req.cookies.visitorId;
        const pageId = req.params.id;

        if (!visitorId) {

            visitorId = uuidv4();

            res.cookie("visitorId", visitorId, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                sameSite: "lax"
            });
        }

        const today = new Date().toISOString().split("T")[0];

        const alreadyCounted = await Visit.findOne({
            visitorId,
            pageId,
            date: today
        });

        if (alreadyCounted) {
            return res.json({
                ok: true,
                message: "already tracked"
            });
        }

        await Visit.create({
            visitorId,
            pageId,
            date: today
        });

        res.json({
            ok: true,
            message: "visit recorded"
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            ok: false,
            message: "Server error"
        });
    }
};

exports.getWeeklyStats = async (req, res) => {
    try {
        const visits = await Visit.find();

        const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        const data = [0,0,0,0,0,0,0];

        visits.forEach(v => {
            const day = new Date(v.createdAt).getDay();
            data[day]++;
        });

        res.json({
            labels: days,
            data
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

