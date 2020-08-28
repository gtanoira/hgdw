"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userCollectionsRoute = exports.UserCollectionsRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const user_collections_controller_1 = require("../controllers/user_collections.controller");
class UserCollectionsRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/payment_commit_history', cors_1.default(), user_collections_controller_1.userCollectionsController.InsertPaymentCommitHistory);
        this.router.post('/rebill_history', cors_1.default(), user_collections_controller_1.userCollectionsController.InsertRebillHistory);
    }
}
exports.UserCollectionsRoute = UserCollectionsRoute;
exports.userCollectionsRoute = new UserCollectionsRoute();
