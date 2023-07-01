const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const projectService = require("../services/project-service");
const { generalResponse } = require("../utils/common-utils");

/* Create project */
router.post(
    "/project",
    [
    check("projectName", "project name, length must less than 20").isLength({ min: 1, max: 20 }),
    check("projectName", "only accept letters in [a-zA-Z0-9\\s\\-_]").matches(/^[a-zA-Z0-9\-_\s]+$/)
    ],
    function(req, res, next) {
    (async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        try {
            const projectDisplayName = req.body.projectName;
            const projectName = req.body.projectName.toLowerCase().replace(/\s/g, "_");

            const project = await projectService.createProject(projectName, projectDisplayName);

            return res.status(StatusCodes.CREATED).send({
                pid: project.pid,
                projectName: project.projectName
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    })();
});

module.exports = router;
