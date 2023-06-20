const mongoose = require("mongoose");
const { ViewSchema } = require("../models/view");

const View = mongoose.model("View", ViewSchema);

const createView = async (pid, viewType) => {
    const view = await new View();
    await view.create(pid, viewType);

    return view;
};

module.exports = {
    createView
};
