"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const controller_helper_functions_1 = require("../controllers/controller.helper-functions");
const checkAuth = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const decodedToken = (0, jsonwebtoken_1.verify)(token, process.env.JWT_KEY);
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId,
            username: decodedToken.username,
        };
        next();
    }
    catch (err) {
        (0, controller_helper_functions_1.catchError)(next, err, 500, 'You are not granted access');
    }
};
exports.checkAuth = checkAuth;
