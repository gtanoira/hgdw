"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebillRoute = exports.RebillRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const rebill_controller_1 = require("../controllers/rebill.controller");
class RebillRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/missing', cors_1.default(), rebill_controller_1.rebillController.InsertMissingRebill);
    }
}
exports.RebillRoute = RebillRoute;
exports.rebillRoute = new RebillRoute();
