"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleEventsRoute = exports.ScheduleEventsRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const schedule_events_controller_1 = require("../controllers/schedule-events.controller");
class ScheduleEventsRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', cors_1.default(), schedule_events_controller_1.scheduleEventsController.index);
    }
}
exports.ScheduleEventsRoute = ScheduleEventsRoute;
exports.scheduleEventsRoute = new ScheduleEventsRoute();
