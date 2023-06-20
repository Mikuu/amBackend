const uuid = require("uuid");

const projectUuid = () => {
    return "PID" + uuid.v4().replace(/-/g, "");
};

const viewUuid = () => {
    return "VID" + uuid.v4().replace(/-/g, "");
};

const nodeUuid = () => {
    return "NID" + uuid.v4().replace(/-/g, "");
};

module.exports = {
    projectUuid,
    viewUuid,
    nodeUuid,
};
