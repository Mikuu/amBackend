const mongoose = require("mongoose");
const { ViewSchema } = require("../models/view");

const View = mongoose.model("View", ViewSchema);

const getView = async (pid, vid) => {
    return await View.findOne({ pid: pid, vid: vid });
};

const createView = async (pid, viewType) => {
    const view = await new View();
    await view.create(pid, viewType);

    return view;
};

module.exports = {
    getView,
    createView
};
