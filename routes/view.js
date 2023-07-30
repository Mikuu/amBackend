const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { generalResponse, catchAsync, GResponse} = require("../utils/common-utils");
const { check, query, validationResult } = require("express-validator");
const viewService = require("../services/view-service");
const nodeService = require("../services/node-service");
const { keycloak } = require("../middlewares/keycloak");

/* Create view */
router.post("/view",
    [
        keycloak.protect('automind-app:app-user'),
        check("pid", "pid must be provided").matches(/^PID[a-zA-Z0-9]+$/),
        check("viewType", "only accept letters in [a-zA-Z]").matches(/^[a-zA-Z]+$/),
        check("viewName", "view name, length must less than 20").isLength({ min: 1, max: 20 }),
        check("viewName", "only accept letters in [a-zA-Z0-9\\s\\-_]").matches(/^[a-zA-Z0-9\-_\s]+$/),
        // check("rootNodeId", "only accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
        // check("rootNodeTopic", "only accept letters in [a-zA-Z\\-_\\s]").matches(/^[a-zA-Z0-9\-_\s]+$/),
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        if (await viewService.viewNameExist(req.body.pid, req.body.viewName)) {
            return res.status(StatusCodes.BAD_REQUEST)
                .send(GResponse.failed(`view '${req.body.viewName}' already exist in current project`));
        }

        const viewDisplayName = req.body.viewName;
        const viewName = viewDisplayName.toLowerCase().replace(/\s/g, "_");
        const view = await viewService.createView(req.body.pid, req.body.viewType, viewName, viewDisplayName);
        // const beginningNode = await nodeService.createNode(view.pid, view.vid,
        //     {
        //         topic: req.body.rootNodeTopic,
        //         id: req.body.rootNodeId,
        //         root: true
        //     });

        return res.status(StatusCodes.CREATED).send({
            pid: view.pid,
            vid: view.vid,
            viewType: view.viewType,
            viewName: view.viewDisplayName
            // rootNode: {
            //     pid: beginningNode.pid,
            //     vid: beginningNode.vid,
            //     nid: beginningNode.nid,
            //     id: beginningNode.id
            // }
        });
    })
);

/* Fetch view */
router.get("/view/:vid",
    [
        keycloak.protect('automind-app:app-user'),
        check("vid", "vid must be provided, accept letters in VID[a-zA-Z0-9]").matches(/^VID[a-zA-Z0-9]+$/),
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        const view = await viewService.getView(req.params.vid);
        if (view) {
            return res.status(StatusCodes.OK).send({
                pid: view.pid,
                vid: view.vid,
                viewType: view.viewType,
                viewName: view.viewDisplayName,
                direction: view.direction,
                theme: {
                    name: view.theme.name,
                    palette: view.theme.palette,
                    cssVar: {
                        "--color": view.theme.cssVar['--color'],
                        "--main-color": view.theme.cssVar['--main-color'],
                        "--bgcolor": view.theme.cssVar['--bgcolor'],
                        "--main-bgcolor": view.theme.cssVar['--main-bgcolor'],
                    }
                }
            });
        } else {
            return res.status(StatusCodes.NOT_FOUND).send(GResponse.notFound("view not found"));
        }
    })
);

/* Fetch a project's all views */
router.get(
    "/views",
    [
        keycloak.protect('automind-app:app-user'),
        query("pid", "missing PID in the form of PID[a-zA-Z0-9]").matches(/^PID[a-zA-Z0-9]+$/)
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        const views = [];
        for(const view of await viewService.getViews(req.query.pid)) {
            views.push({
                pid: view.pid,
                vid: view.vid,
                viewType: view.viewType,
                viewName: view.viewDisplayName
            });
        }

        return res.status(StatusCodes.OK).send({
            pid: req.body.pid,
            counts: views.length,
            views
        });
    })
);

/* Delete a project's all views */
router.delete(
    "/views",
    [
        keycloak.protect('automind-app:app-user'),
        query("pid", "missing PID in the form of PID[a-zA-Z0-9]").matches(/^PID[a-zA-Z0-9]+$/)
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        let deletedNodesCount = 0;
        let deletedViewsCount = 0;
        for (const view of await viewService.getViews(req.query.pid)) {
            const deletingNodesCount = await nodeService.deleteNodesByVid(view.vid);
            const deletingViewsCount = await viewService.deleteViewsByPid(view.pid);

            deletedNodesCount += deletingNodesCount;
            deletedViewsCount += deletingViewsCount;
        }

        return res.status(StatusCodes.OK).send({
            pid: req.body.pid,
            deletedViewsCount,
            deletedNodesCount
        })
    })
);

/* Delete view */
router.delete(
    "/view/:vid",
    [
        keycloak.protect('automind-app:app-user'),
        check("vid", "missing VID in the form of [a-zA-Z0-9]").matches(/^VID[a-zA-Z0-9]+$/)
    ],
    catchAsync(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        const deletedNodesCount = await nodeService.deleteNodesByVid(req.params.vid);
        const deletedViewsCount = await viewService.deleteView(req.params.vid);

        return res.status(StatusCodes.OK).send({
            vid: req.body.vid,
            deletedViewsCount,
            deletedNodesCount
        });
    })
);

module.exports = router;
