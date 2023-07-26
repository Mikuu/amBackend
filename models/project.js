"use strict";

const mongoose = require("mongoose");
const uuidUtils = require("../utils/uuid-utils");
const { createEncryptedAPIKey, decryptAPIKey } = require("../utils/auth-utils");

const Schema = mongoose.Schema;

/**
 * Project Schema
 */
const ProjectSchema = new Schema({
    pid: { type: String, default: "", trim: true, maxlength: 50, unique: true, required: true },
    apiKey: { type: String, default: "", trim: true, maxlength: 100, unique: true, required: true },
    projectName: { type: String, default: "", trim: true, maxlength: 50, unique: true, required: true },
    projectDisplayName: { type: String, default: "", trim: true, maxlength: 50, unique: true, required: true },
}, { timestamps: true });

/**
 * Validations
 */

ProjectSchema.path("projectName").required(true, "Project name cannot be blank");
ProjectSchema.path("pid").required(true, "Project Id cannot be blank");

/**
 * Pre-remove hook
 */

/**
 * Methods
 */
ProjectSchema.methods = {
    create: function(projectName, projectDisplayName) {
        this.projectName = projectName;
        this.projectDisplayName = projectDisplayName;
        this.apiKey = createEncryptedAPIKey();

        this.pid = uuidUtils.projectUuid();
        return this.save();
    },

    getAPIKey: function() {
        return decryptAPIKey(this.apiKey);
    }
};

module.exports = {
    ProjectSchema,
};
