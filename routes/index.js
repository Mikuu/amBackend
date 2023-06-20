const express = require("express");
const router = express.Router();

router.get("/echo", function(req, res, next) {
    res.send("Service Alive");
});

module.exports = router;
