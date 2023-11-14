"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = require("../models/user.model");
const controller_helper_functions_1 = require("./controller.helper-functions");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const generatedHash = yield (0, bcrypt_1.hash)(req.body.password, 10);
        const user = new user_model_1.User({
            username: req.body.username,
            email: req.body.email,
            password: generatedHash,
        });
        const userCreated = yield user.save();
        res
            .status(201)
            .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.SUCCESS, 'Signup successful,User is created', userCreated));
    }
    catch (err) {
        (0, controller_helper_functions_1.catchError)(next, err, 500, 'Invalid authentication credentials');
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundUser = yield user_model_1.User.findOne({ email: req.body.email });
        if (!foundUser) {
            return res.status(401).json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.ERROR, 'Authentication Failed'));
        }
        const giveAccess = yield (0, bcrypt_1.compare)(req.body.password, foundUser.password);
        if (!giveAccess) {
            return res.status(401).json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.ERROR, 'Authentication Failed'));
        }
        const jwtToken = (0, jsonwebtoken_1.sign)({
            email: foundUser.email,
            userId: foundUser._id,
            username: foundUser.username,
        }, process.env.JWT_KEY, { expiresIn: '1h' });
        const responseToBeSent = {
            token: jwtToken,
            expiresIn: 3600,
            userId: foundUser._id,
            username: foundUser.username,
        };
        res
            .status(200)
            .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.SUCCESS, 'Login Successful', responseToBeSent));
    }
    catch (err) {
        (0, controller_helper_functions_1.catchError)(next, err, 500, 'Error found when logging in');
    }
});
exports.loginUser = loginUser;
