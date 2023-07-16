const express = require("express");
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { generalResponse } = require("../utils/common-utils");
const { check, query, validationResult } = require("express-validator");
const viewService = require("../services/view-service");
const nodeService = require("../services/node-service");
const { keycloak } = require("../middlewares/keycloak");

/* Create view */
router.post("/view",
    [
        keycloak.protect('automind-app:app-user'),
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

/* Fetch view */
router.get("/view",
    [
        keycloak.protect('automind-app:app-user'),
        query("pid", "pid must be provided, accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
        query("vid", "vid must be provided, accept letters in [a-zA-Z0-9]").matches(/^[a-zA-Z0-9]+$/),
    ],
    function(req, res, next) {
    (async () => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(StatusCodes.BAD_REQUEST).json(generalResponse(errors.array()).failed);
        }

        viewService.getView(req.query.pid, req.query.vid)
            .then(view => {
                if (!view) {
                    return res.status(StatusCodes.NOT_FOUND).send({
                        pid: req.query.pid,
                        vid: req.query.vid,
                        message: "view not found",
                    });
                }

                return res.status(StatusCodes.OK).send({
                    pid: view.pid,
                    vid: view.vid,
                    viewType: view.viewType,
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
            })
            .catch(error => {
                console.error(error);
                next(error);
            });
    })();
});

module.exports = router;
