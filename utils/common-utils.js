const { StatusCodes } = require('http-status-codes');
const {response} = require("express");

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

const GResponse = {
    succeed(message) {
        return {
            code: StatusCodes.OK,
            message: message
        }
    },

    failed(message) {
        return {
            code: StatusCodes.BAD_REQUEST,
            message: message
        }
    },

    error(message) {
        return {
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message: message
        }
    },
}

const catchAsync = (asyncFunction) => {
    return (req, res, next) => {
        asyncFunction(req, res, next).catch(error => {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(GResponse.error("System Error"));
        });
    };
};

module.exports = {
    processLogger,
    generalResponse,
    catchAsync,
    GResponse,
}
