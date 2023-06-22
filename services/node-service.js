const mongoose = require("mongoose");
const { NodeSchema } = require("../models/node");

const Node = new mongoose.model('Node', NodeSchema);

const createNode = async (pid, vid, id, topic, root, children) => {
    const node = await new Node();
    await node.create(pid, vid, id, topic, root, children);

    return node;
};

const updateNodeByNid = async (id, newValues) => {
    return await Node.findOneAndUpdate({ id: id }, newValues, { new: true });
};

module.exports = {
    createNode
};
