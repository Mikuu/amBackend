const mongoose = require("mongoose");
const { NodeSchema } = require("../models/node");
const { nodeUuid } = require("../utils/uuid-utils");

const Node = new mongoose.model('Node', NodeSchema);

const fetchNodes = async (pid, vid) => {
    return await Node.find({pid: pid, vid: vid});
};

const getNode = async (pid, vid, id) => {
    return await Node.findOne({pid, vid, id});
};

const findNode = async (options) => {
    return await Node.findOne(options);
};

const updateNode = async (filterOptions, updateOptions) => {
    return await Node.updateOne(filterOptions, updateOptions);
};

const createNode = async (pid, vid, nodeData) => {
    const newNode = await Node();
    newNode.pid = pid;
    newNode.vid = vid;
    newNode.nid = nodeUuid();

    for (let key in nodeData) {
        if (nodeData.hasOwnProperty(key) && nodeData[key] !== undefined && nodeData[key] !== null) {
            newNode[key] = nodeData[key];
        }
    }

    await newNode.save();
    return newNode;
};

const appendChild = async (parentNode, childNode) => {
    if (!parentNode.childrenIds.includes(childNode.id)) {
        parentNode.childrenIds.push(childNode.id);
        await parentNode.save();
    }
};

const findAndUpdateNode = async (pid, vid, nodeData) => {
    return await Node.findOneAndUpdate({ pid: pid, vid: vid, id: nodeData.id},
        {
            topic: nodeData.topic,
            memo: nodeData.memo,
            style: nodeData.style,
            tags: nodeData.tags,
            icons: nodeData.icons,
            hyperLink: nodeData.hyperLink,
            root: nodeData.root,
            childrenIds: nodeData.childrenIds,
            direction: nodeData.direction,
            parentId: nodeData.parentId,
        }, { new: true });
};

const deleteNode = async (pid, vid, id) => {
    let deletedCount = 0;

    const nodeData = await Node.findOne({id});
    if (!nodeData) {
        return;
    }

    /** remove id from parent's children list **/
    const parentNode = await Node.findOne({ id: nodeData.parentId });
    if (parentNode) {
        parentNode.childrenIds = parentNode.childrenIds.filter(id => id !== nodeData.id);
        await parentNode.save();
    }

    /** delete all children nodes **/
    const deleteNodeAndChildren = async id => {
        const targetNode = await Node.findOne({ pid, vid, id });
         if (!targetNode) {
             return;
         }

        /** delete current node **/
        const result = await Node.deleteOne({ pid, vid, id });
        deletedCount += result.deletedCount;

        for (const childId of targetNode.childrenIds) {
            await deleteNodeAndChildren(childId);
        }
    }

    await deleteNodeAndChildren(nodeData.id);


    return deletedCount;
};

module.exports = {
    fetchNodes,
    getNode,
    findNode,
    updateNode,
    createNode,
    appendChild,
    findAndUpdateNode,
    deleteNode,
};
