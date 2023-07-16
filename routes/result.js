const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { generalResponse, catchAsync } = require("../utils/common-utils");
const { check, query, validationResult } = require("express-validator");
const nodeService = require("../services/node-service");
const { keycloak } = require("../middlewares/keycloak");

/* update result nodes */
router.put("/nodes/results", [
        keycloak.protect("automind-backend:internal-service"),
        check("pid", "pid must be provided").matches(/^[a-zA-Z0-9]+$/),
        check("vid", "vid only accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
        check("tests", "array of test nodes").isArray(),
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        const updatedTests = [];
        for (const test of req.body.tests) {
            console.log(test);

            updatedTests.push(test.id);
        }

        return res.status(StatusCodes.OK).send({ pid: req.body.pid, vid: req.body.vid, updatedTests: updatedTests });
    })

);

module.exports = router;
