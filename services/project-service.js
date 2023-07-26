const mongoose = require("mongoose");
const { ProjectSchema } = require("../models/project");

const Project = mongoose.model("Project", ProjectSchema);

const createProject = async (projectName, projectDisplayName) => {
    const project = await new Project();
    await project.create(projectName, projectDisplayName);

    return project;
};

const getProjects = async () => {
    return await Project.find();
};

const getProjectByPid = async pid => {
    return await Project.findOne({ pid });
};

module.exports = {
    getProjects,
    createProject,
    getProjectByPid,
};
