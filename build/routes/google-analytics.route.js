"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAnalyticsRoute = exports.GoogleAnalyticsRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const google_analytics_controller_1 = require("../controllers/google-analytics.controller");
class GoogleAnalyticsRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/view', cors_1.default(), google_analytics_controller_1.googleAnalyticsController.index);
    }
}
exports.GoogleAnalyticsRoute = GoogleAnalyticsRoute;
exports.googleAnalyticsRoute = new GoogleAnalyticsRoute();
