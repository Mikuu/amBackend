const mongoose = require("mongoose");
const { ProjectSchema } = require("../models/project");
const nodeService = require("./node-service");
const viewService = require("./view-service");

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

const deleteProject = async (pid) => {
    const deletedNodesCount = await nodeService.deleteNodesByPid(pid);
    const deletedViewsCount = await viewService.deleteViewsByPid(pid);

    const { deletedCount } = await Project.deleteMany({ pid });

    return { deletedProjectCount: deletedCount, deletedNodesCount, deletedViewsCount };
};

const projectNameExist = async (projectDisplayName) => {
    const project = await Project.findOne({ projectDisplayName: new RegExp(projectDisplayName, 'i') });
    return !!project;
};

module.exports = {
    getProjects,
    createProject,
    getProjectByPid,
    deleteProject,
    projectNameExist,
};
