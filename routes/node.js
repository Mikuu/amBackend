const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { generalResponse } = require("../utils/common-utils");
const { check, validationResult } = require("express-validator");
const nodeService = require("../services/node-service");

/* Create node */
router.post("/nodes/bulk", [
        check("pid", "pid must be provided").matches(/^[a-zA-Z0-9]+$/),
        check("vid", "vid only accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
        check("updateNodes", "updateNodes must be provide as an array").isArray(),
        check("deleteNodeIds", "deleteNodeIds must be provide as an array").isArray(),
    ],
    function(req, res, next) {
    (async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        console.log("payload -->");
        console.log(req.body);

        try {
            let updatedCount = 0;
            let deleteCount = 0;
            let updatedNode;
            let statusCode = StatusCodes.OK;

            // consider user Model.bulkSave() in case of performance issue.
            for (let nodeData of req.body.updateNodes) {
                updatedNode = await nodeService.findAndUpdateNode(req.body.pid, req.body.vid, nodeData);

                if (!updatedNode) {
                    await nodeService.createNode(req.body.pid, req.body.vid, nodeData);
                    statusCode = StatusCodes.CREATED;
                }
                updatedCount++;
            }

            for (let id of req.body.deleteNodeIds) {
                deleteCount = await nodeService.deleteNode(req.body.pid, req.body.vid, id);
            }

            return res.status(statusCode).send({ updatedCount, deleteCount });

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
