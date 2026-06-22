"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
const ErrorHandler_1 = __importDefault(require("./Middlewares/ErrorHandler"));
const TestRunRoutes_1 = __importDefault(require("./Routes/TestRunRoutes"));
const ProjectRoutes_1 = __importDefault(require("./Routes/ProjectRoutes"));
const app = (0, express_1.default)();
(0, db_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/screenshots', express_1.default.static(path_1.default.join(__dirname, '../Public/screenshots')));
app.use('/api/tests', TestRunRoutes_1.default);
app.use('/api/projects', ProjectRoutes_1.default);
app.use(ErrorHandler_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running at PORT ...... ${process.env.PORT}`);
});
