"use strict";

const mongoose = require("mongoose");
const uuidUtils = require("../utils/uuid-utils");

const Schema = mongoose.Schema;

/**
 * Build Schema
 */
const NodeSchema = new Schema({
    pid: { type: String, default: "", trim: true, maxlength: 50 },
    vid: { type: String, default: "", trim: true, maxlength: 50 },
    nid: { type: String, default: "", trim: true, maxlength: 50 },

    // Elixir default attributes
    id: { type: String, default: "", trim: true, maxlength: 50 },
    topic: { type: String, default: "", trim: true, maxlength: 5000 },
    memo: { type: String, default: "", trim: true, maxlength: 9999 },
    style: {},
    // parent: {},
    tags: [{ type: String }],
    icons: [{ type: String }],
    hyperLink: { type: String, default: "", trim: true, maxlength: 50 },
    image: {},
    root: { type: Boolean, default: false },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Node'}],
    direction: { type: Number, default: 0, enum: [0, 1] },
});

/**
 * Validations
 */
NodeSchema.path("pid").required(true, "pid cannot be blank");
NodeSchema.path("vid").required(true, "vid cannot be blank");
NodeSchema.path("nid").required(true, "nid cannot be blank");
NodeSchema.path("id").required(true, "id cannot be blank");

/**
 * Methods
 */
NodeSchema.methods = {
    create: function (pid, vid, id, topic, root, children) {
        this.pid = pid;
        this.vid = vid;
        this.nid = uuidUtils.nodeUuid();
        this.id = id;
        this.topic = topic;
        this.root = root;
        this.children = children;
        this.direction = 0;

        return this.save();
    }
};

module.exports = {
    NodeSchema
};
