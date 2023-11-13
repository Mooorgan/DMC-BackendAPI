"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.sendResponse = exports.ERROR = exports.SUCCESS = void 0;
exports.SUCCESS = 'success';
exports.ERROR = 'error';
const sendResponse = (status, message, responseObject) => {
    const responseToBeSent = {
        status,
        message,
        result: responseObject,
    };
    return responseToBeSent;
};
exports.sendResponse = sendResponse;
const catchError = (next, orginalError, httpStatusCode, message) => {
    const error = new Error(orginalError);
    error.httpStatusCode = httpStatusCode;
    error.message = message;
    return next(error);
};
exports.catchError = catchError;
