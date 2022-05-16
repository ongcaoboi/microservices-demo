const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.get("/", (req, res) => {
    res.json({
        user: "user1",
        role: "normal"
    });
});

app.get("/user", (req, res) => {
    res.json({
        user: "user1",
        role: "normal"
    });
});

module.exports = app;