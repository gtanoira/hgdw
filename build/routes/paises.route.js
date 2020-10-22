"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paisesRoute = exports.PaisesRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const paises_controller_1 = require("../controllers/paises.controller");
class PaisesRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', cors_1.default(), paises_controller_1.paisesController.index);
    }
}
exports.PaisesRoute = PaisesRoute;
exports.paisesRoute = new PaisesRoute();
