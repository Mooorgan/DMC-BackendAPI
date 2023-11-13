"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const check_auth_middleware_1 = require("../middlewares/check-auth.middleware");
const router = express_1.default.Router();
exports.taskRoutes = router;
router.get('', task_controller_1.getTasks);
router.post('', check_auth_middleware_1.checkAuth, task_controller_1.createTask);
router.get('/:id', task_controller_1.getTask);
router.put('/:id', check_auth_middleware_1.checkAuth, task_controller_1.updateTask);
router.delete('/:id', check_auth_middleware_1.checkAuth, task_controller_1.deleteTask);
