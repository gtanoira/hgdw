"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoute = exports.RegisterRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const register_controller_1 = require("../controllers/register.controller");
class RegisterRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/history', cors_1.default(), register_controller_1.registerController.InsertHistory);
        this.router.patch('/del_duplicates', cors_1.default(), register_controller_1.registerController.delDuplicateRegister);
    }
}
exports.RegisterRoute = RegisterRoute;
exports.registerRoute = new RegisterRoute();
