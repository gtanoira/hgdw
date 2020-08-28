"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.titlesRoute = exports.TitlesRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const titles_controller_1 = require("../controllers/titles.controller");
class TitlesRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/publish', cors_1.default(), titles_controller_1.titlesController.publishTitles);
    }
}
exports.TitlesRoute = TitlesRoute;
exports.titlesRoute = new TitlesRoute();
