"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const task_routes_1 = require("./routes/task.routes");
const user_routes_1 = require("./routes/user.routes");
const error_controller_1 = require("./controllers/error.controller");
dotenv_1.default.config({ path: './config.env' });
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.MONGO_DB_CONNECTION_STRING);
mongoose_1.default
    .connect(db)
    .then(() => {
    console.log('Connected to database');
})
    .catch((err) => {
    console.log('Connection failed');
});
const app = (0, express_1.default)();
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    next();
});
app.use(express_1.default.json());
app.use('/api/task', task_routes_1.taskRoutes);
app.use('/api/user', user_routes_1.userRoutes);
app.use(error_controller_1.get404);
app.use(error_controller_1.get500);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
