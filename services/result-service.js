const nodeService = require("./node-service");
const { elixirUuid } = require("../utils/uuid-utils");

const mapResultNodeData = resultString => {
    const nodeData = {};
    switch (resultString) {
        case 'passed':
            nodeData.topic = 'AT-Passed';
            nodeData.style = {"background": "#93ff00", "color": "#0a910a", "padding-inline": "8px"};
            break;
        case 'failed':
            nodeData.topic = 'AT-Failed';
            nodeData.style = {"background": "#ff024391", "color": "#f9f5df", "padding-inline": "8px"};
            break;
        default:
            nodeData.topic = 'AT-Unknown';
            nodeData.style = {"background": "#5002ff6b", "color": "#f9f5df", "padding-inline": "8px"};
    }

    return nodeData
}

const createOrUpdateResult = async (pid, vid, testNodeId, result) => {
    const testNode = await nodeService.findNode({ pid: pid, vid: vid, id: testNodeId });
    if (!testNode) { return }

    let resultNode = await nodeService.findNode({
        pid: pid,
        vid: vid,
        parentId: testNodeId,
        nodeType: 'at-result'
    });

    const nodeData = mapResultNodeData(result);
    if (resultNode) {
        await nodeService.updateNode({
            pid: resultNode.pid,
            vid: resultNode.vid,
            id: resultNode.id,
        }, nodeData);
        resultNode = await nodeService.findNode({ id: resultNode.id });

    } else {
        resultNode = await nodeService.createNode(pid, vid, {
            id: elixirUuid(),
            parentId: testNodeId,
            nodeType: 'at-result',
            ...nodeData
        });
        await nodeService.appendChild(testNode, resultNode);
    }

    return resultNode;
};

module.exports = {
    createOrUpdateResult
};
