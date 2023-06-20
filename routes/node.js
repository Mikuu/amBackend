const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { response } = require("../utils/common-utils");

/* Create node */
router.post("/node", function(req, res, next) {
    (async () => {
        try {
            res.status(StatusCodes.OK).send(response('node created').succeed);
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
