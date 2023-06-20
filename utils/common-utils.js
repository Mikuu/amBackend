const { StatusCodes } = require('http-status-codes');

const processLogger = (message) => {
    console.log(`CPId=${process.pid} | ${message}`);
};


const generalResponse = message => {
    return {
        succeed: {
            code: StatusCodes.OK,
            message: message,
        },
        failed: {
            code: StatusCodes.BAD_REQUEST,
            message: message,
        },
    };
};

module.exports = {
    processLogger,
    generalResponse
}
