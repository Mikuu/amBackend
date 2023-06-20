const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { response } = require("../utils/common-utils");

/* Create view */
router.post("/view", function(req, res, next) {
    (async () => {
        try {
            res.status(StatusCodes.OK).send(response('view created').succeed);
        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
