"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get500 = exports.get404 = void 0;
const controller_helper_functions_1 = require("./controller.helper-functions");
const get404 = (req, response, next) => {
    response.status(404).json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.ERROR, 'page not found'));
};
exports.get404 = get404;
const get500 = (
//   error: ErrorRequestHandler,
error, req, response, next) => {
    response
        .status(error.httpStatusCode)
        .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.ERROR, error.message));
};
exports.get500 = get500;
