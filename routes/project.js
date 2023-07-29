const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const projectService = require("../services/project-service");
const { generalResponse, catchAsync, GResponse } = require("../utils/common-utils");
const { keycloak } = require("../middlewares/keycloak");

/* Retrieve projects */
router.get(
    "/projects",
    [
        keycloak.protect('automind-app:app-user'),
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        // ToDo: validate user info to return authorized projects, not all projects.

        const response = [];
        for(const project of await projectService.getProjects()) {
            response.push({
                pid: project.pid,
                projectName: project.projectDisplayName
            })
        }

        return res.status(StatusCodes.OK).send({
            counts: response.length,
            projects: response
        })
    })
);

/* Get projects */
router.get(
    "/project/:pid",
    [
        keycloak.protect('automind-app:app-user'),
        check("pid", "missing PID in the form of [a-zA-Z0-9]").matches(/^PID[a-zA-Z0-9]+$/)
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        // ToDo: validate user info to return authorized projects, not all projects.

        const project = await projectService.getProjectByPid(req.params.pid);

        if (project) {
            return res.status(StatusCodes.OK).send({
                pid: project.pid,
                projectName: project.projectDisplayName
            })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).send(GResponse.failed("project not found"));
        }

    })
);

/* Delete project */
router.delete(
    "/project/:pid",
    [
        keycloak.protect('automind-app:app-user'),
        check("pid", "missing PID in the form of [a-zA-Z0-9]").matches(/^PID[a-zA-Z0-9]+$/)
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        // ToDo: validate if the user is authorized to delete its given pid project

        const { deletedProjectCount, deletedNodesCount, deletedViewsCount } = await projectService.deleteProject(req.params.pid);

        return res.status(StatusCodes.OK).send({
            pid: req.params.pid,
            deletedProjectCount,
            deletedViewsCount,
            deletedNodesCount
        })
    })
);

/* Create project */
router.post(
    "/project",
    [
        keycloak.protect('automind-app:app-user'),
        check("projectName", "project name, length must less than 20").isLength({ min: 1, max: 20 }),
        check("projectName", "only accept letters in [a-zA-Z0-9\\s\\-_]").matches(/^[a-zA-Z0-9\-_\s]+$/)
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        const projectDisplayName = req.body.projectName;
        const projectName = req.body.projectName.toLowerCase().replace(/\s/g, "_");

        if (await projectService.projectNameExist(projectDisplayName)) {
            return res.status(StatusCodes.BAD_REQUEST).send(GResponse.failed(`project name '${projectDisplayName}' already exists`));
        }

        const project = await projectService.createProject(projectName, projectDisplayName);

        return res.status(StatusCodes.CREATED).send({
            pid: project.pid,
            projectName: project.projectDisplayName
        });
    })
);

module.exports = router;
