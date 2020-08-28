"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelRoute = exports.CancelRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const cancel_controller_1 = require("../controllers/cancel.controller");
class CancelRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/history', cors_1.default(), cancel_controller_1.cancelController.InsertCancelHistory);
    }
}
exports.CancelRoute = CancelRoute;
exports.cancelRoute = new CancelRoute();
