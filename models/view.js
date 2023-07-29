"use strict";

const mongoose = require("mongoose");
const uuidUtils = require("../utils/uuid-utils");

const Schema = mongoose.Schema;

const CssVarSchema = new Schema({
    '--bgcolor': { type: String, default: "#f6f6f6", trim: true, maxlength: 50 },
    '--color': { type: String, default: "#777777", trim: true, maxlength: 50 },
    '--main-bgcolor': { type: String, default: "#ffffff", trim: true, maxlength: 50 },
    '--main-color': { type: String, default: "#444446", trim: true, maxlength: 50 },
}, { timestamps: true });

const ThemeSchema = new Schema({
    cssVar: { type: CssVarSchema, default: () => ({}) },
    name: { type: String, default: "Latte", trim: true, maxlength: 50 },
    palette: { type: [String], default: ["#dd7878", "#ea76cb", "#8839ef", "#e64553", "#fe640b", "#df8e1d", "#40a02b", "#209fb5", "#1e66f5", "#7287fd"]},
}, { timestamps: true });

/**
 * View Schema
 */
const ViewSchema = new Schema({
    pid: { type: String, default: "", trim: true, maxlength: 50 },
    vid: { type: String, default: "", trim: true, maxlength: 50 },
    // requirements, tests, automation
    viewType: { type: String, default: "requirements", trim: true, maxlength: 15 },
    viewName: { type: String, default: "", trim: true, maxlength: 50, unique: true, required: true },
    viewDisplayName: { type: String, default: "", trim: true, maxlength: 50, unique: true, required: true },

    /** Elixir default attributes **/
    direction: { type: Number, default: 1, enum: [0, 1] },
    theme: { type: ThemeSchema, default: () => ({}) },

    /** Default, but NOT ot to support **/
    // linkData: {},
}, { timestamps: true });

/**
 * Validations
 */
ViewSchema.path("pid").required(true, "pid cannot be blank");
ViewSchema.path("viewType").required(true, "view type cannot be blank");

/**
 * Methods
 */
ViewSchema.methods = {
    create: function(pid, viewType, viewName, viewDisplayName) {
        this.pid = pid;
        this.vid = uuidUtils.viewUuid();
        this.viewType = viewType;
        this.viewName = viewName;
        this.viewDisplayName = viewDisplayName;
        return this.save();
    }
};

module.exports = {
    ViewSchema,
};
