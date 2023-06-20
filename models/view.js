"use strict";

const mongoose = require("mongoose");
const uuidUtils = require("../utils/uuid-utils");

const Schema = mongoose.Schema;

/**
 * Build Schema
 */
const ViewSchema = new Schema({
    pid: { type: String, default: "", trim: true, maxlength: 50 },
    vid: { type: String, default: "", trim: true, maxlength: 50 },
    // requirements, tests, automation
    viewType: { type: String, default: "requirements", trim: true, maxlength: 15 },
});

/**
 * Validations
 */
ViewSchema.path("pid").required(true, "pid cannot be blank");
ViewSchema.path("viewType").required(true, "view type cannot be blank");

/**
 * Methods
 */
ViewSchema.methods = {
    create: function(pid, viewType) {
        this.pid = pid;
        this.vid = uuidUtils.viewUuid();
        this.viewType = viewType;
        return this.save();
    }
};

module.exports = {
    ViewSchema,
};
