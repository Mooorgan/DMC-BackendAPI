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
exports.deleteTask = exports.getTask = exports.getTasks = exports.updateTask = exports.createTask = void 0;
const task_model_1 = require("../models/task.model");
const controller_helper_functions_1 = require("./controller.helper-functions");
const createTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const task = new task_model_1.Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        creator: req.userData.userId,
        username: req.userData.username,
    });
    try {
        const createdTask = yield task.save();
        res
            .status(201)
            .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.SUCCESS, 'Task successfully created', createdTask));
    }
    catch (err) {
        (0, controller_helper_functions_1.catchError)(next, err, 500, 'Creating a task failed.');
    }
});
exports.createTask = createTask;
const updateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const task = {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        creator: req.userData.userId,
        username: req.userData.username,
    };
    try {
        const updatedResult = yield task_model_1.Task.updateOne({ _id: req.params.id, creator: req.userData.userId }, task);
        if (updatedResult.matchedCount > 0) {
            res.status(200).json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.SUCCESS, 'Task successfully updated'));
        }
        else {
            res
                .status(401)
                .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.ERROR, 'Not authorized to update task'));
        }
    }
    catch (err) {
        (0, controller_helper_functions_1.catchError)(next, err, 500, 'Updating a task failed.');
    }
});
exports.updateTask = updateTask;
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSizeString = req.query.pageSize;
    const currentPageString = req.query.page;
    try {
        const taskQuery = task_model_1.Task.find();
        if (pageSizeString && currentPageString) {
            const pageSize = +pageSizeString;
            const currentPage = +currentPageString;
            taskQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        const documents = yield taskQuery.exec();
        const count = yield task_model_1.Task.countDocuments();
        const responseToBeSent = {
            tasks: documents,
            maxTasks: count,
        };
        res
            .status(200)
            .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.SUCCESS, 'Tasks successfully fetched', responseToBeSent));
    }
    catch (err) {
        (0, controller_helper_functions_1.catchError)(next, err, 500, 'Fetching all tasks failed.');
    }
});
exports.getTasks = getTasks;
const getTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_model_1.Task.findById(req.params.id);
        if (task) {
            res
                .status(200)
                .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.SUCCESS, 'Specified single task successfully fetched', task));
        }
        else {
            res
                .status(404)
                .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.ERROR, 'Specified single task not found'));
        }
    }
    catch (err) {
        (0, controller_helper_functions_1.catchError)(next, err, 500, 'Fetching specified single task failed.');
    }
});
exports.getTask = getTask;
const deleteTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteResult = yield task_model_1.Task.deleteOne({
            _id: req.params.id,
            creator: req.userData.userId,
        });
        if (deleteResult.deletedCount > 0) {
            res
                .status(200)
                .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.SUCCESS, 'Deleting the specified single task succeeded'));
        }
        else {
            res
                .status(401)
                .json((0, controller_helper_functions_1.sendResponse)(controller_helper_functions_1.ERROR, 'Not authorized to delete this specified single task'));
        }
    }
    catch (err) {
        (0, controller_helper_functions_1.catchError)(next, err, 500, 'Deleting specified single task failed.');
    }
});
exports.deleteTask = deleteTask;
