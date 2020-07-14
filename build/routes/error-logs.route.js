"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogsRoute = exports.ErrorLogsRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const error_logs_controller_1 = require("../controllers/error-logs.controller");
class ErrorLogsRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', cors_1.default(), error_logs_controller_1.errorLogsController.index);
    }
}
exports.ErrorLogsRoute = ErrorLogsRoute;
exports.errorLogsRoute = new ErrorLogsRoute();
