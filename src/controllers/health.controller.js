exports.health = (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            service: "Ask Ravi Service",
            status: "UP",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            uptime: `${process.uptime().toFixed(2)} seconds`
        }
    });
};