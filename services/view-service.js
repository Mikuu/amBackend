const mongoose = require("mongoose");
const { ViewSchema } = require("../models/view");
const nodeService = require("./node-service");

const View = mongoose.model("View", ViewSchema);

const getView = async (vid) => {
    return await View.findOne({ vid: vid });
};

const getViews = async (pid) => {
    return await View.find({ pid });
};

const createView = async (pid, viewType, viewName, viewDisplayName) => {
    const view = await new View();
    await view.create(pid, viewType, viewName, viewDisplayName);
    return view;
};

const deleteViewsByPid = async (pid) => {
    const { deletedCount } = await View.deleteMany({ pid });
    return deletedCount;
};

const deleteView = async (vid) => {
    const { deletedCount } = await View.deleteOne({ vid });
    return deletedCount;
};

const viewNameExist = async (pid, viewDisplayName) => {
    const view = await View.findOne({ pid, viewDisplayName: new RegExp(viewDisplayName, 'i') });
    return !!view;
};

module.exports = {
    getView,
    getViews,
    createView,
    deleteViewsByPid,
    deleteView,
    viewNameExist
};
