const express = require("express");
const mongoose = require("mongoose");

// Router Middleware
const router = express.Router();


router.get("/", (req, res) => {
    res.send("Hello");
});








module.exports = router;

