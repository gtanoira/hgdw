"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesosBatchsRoute = exports.ProcesosBatchsRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const procesos_batchs_controller_1 = require("../controllers/procesos-batchs.controller");
class ProcesosBatchsRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', cors_1.default(), procesos_batchs_controller_1.procesosBatchsController.index);
        this.router.delete('/:id', cors_1.default(), procesos_batchs_controller_1.procesosBatchsController.delete);
    }
}
exports.ProcesosBatchsRoute = ProcesosBatchsRoute;
exports.procesosBatchsRoute = new ProcesosBatchsRoute();
