const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { generalResponse } = require("../utils/common-utils");
const { check, validationResult } = require("express-validator");
const viewService = require("../services/view-service");
const nodeService = require("../services/node-service");

/* Create view */
router.post("/view",
    [
        check("pid", "pid must be provided").matches(/^[a-zA-Z0-9]+$/),
        check("viewType", "only accept letters in [a-zA-Z]").matches(/^[a-zA-Z]+$/),
        check("id", "only accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
        check("topic", "only accept letters in [a-zA-Z\\-_\\s]").matches(/^[a-zA-Z0-9\-_\s]+$/),
    ],
    function(req, res, next) {
    (async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        try {
            const view = await viewService.createView(req.body.pid, req.body.viewType);
            const beginningNode = await nodeService.createNode(view.pid, view.vid,
                {
                    topic: req.body.topic,
                    id: req.body.id,
                    root: true
                });

            return res.status(StatusCodes.CREATED).send({
                pid: beginningNode.pid,
                vid: beginningNode.vid,
                nid: beginningNode.nid,
                id: beginningNode.id
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
