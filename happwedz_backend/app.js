const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/auth/register", (req, res) => {
    res.json({
        message: "✅ Server is working",
        body: req.body
    });
});

app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
