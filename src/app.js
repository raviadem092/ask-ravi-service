const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/health.routes");
const chatRoutes = require("./routes/chat.routes");
const questionRoutes = require("./routes/question.routes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Ask Ravi Service is running..."
    });
});

app.use("/api/chat", chatRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/questions", questionRoutes);
module.exports = app;