"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Build Schema
 */
const NodeSchema = new Schema({
    pid: { type: String, default: "", trim: true, maxlength: 50 },
    vid: { type: String, default: "", trim: true, maxlength: 50 },
    nid: { type: String, default: "", trim: true, maxlength: 50 },

    parentId: { type: String, default: "", trim: true, maxlength: 50 },
    nodeType: { type: String, default: "general", enum: ['scenario', 'test', 'mt-result', 'at-result', 'general'], trim: true },

    /** Elixir default attributes **/
    id: { type: String, default: "", trim: true, maxlength: 50 },
    topic: { type: String, default: "", trim: true, maxlength: 5000 },
    memo: { type: String, default: "", trim: true, maxlength: 9999 },
    style: { type: Schema.Types.Mixed, default: {}, trim: true, maxlength: 1000 },
    tags: [{ type: String }],
    icons: [{ type: String }],
    hyperLink: { type: String, default: "", trim: true, maxlength: 50 },
    root: { type: Boolean, default: false },
    childrenIds: [{ type: String }],
    direction: { type: Number, default: 0, enum: [0, 1] },

    /** Default, but NOT ot to support **/
    // image: {},
    // parent: {
}, { timestamps: true });

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
NodeSchema.methods = {};

module.exports = {
    NodeSchema
};
