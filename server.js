const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const connectDB = require("./config/db");


const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
}));


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

const userRouter = require("./routers/userRouter");
app.use("/auth", userRouter);

const userManagementRouter = require('./routers/userMangementRouter');
app.use("/manage", userManagementRouter);

const eventRouter = require('./routers/eventRouter');
app.use("/events", eventRouter);

const blogRouter = require('./routers/blogRouter');
app.use("/blogs", blogRouter);

const liveRoutes = require("./routers/liveRouter");
app.use("/live", liveRoutes);

const visitRouter = require("./routers/visitRouter")
app.use("/analytics", visitRouter)


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Server is running on http://localhost:${PORT}`)
        });
    } catch (error) {
        console.error("Failed to start server", error.message);
        process.exit(1);
    }
}
startServer();
