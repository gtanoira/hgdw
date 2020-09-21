"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentCommitRoute = exports.PaymentCommitRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const payment_commit_controller_1 = require("../controllers/payment_commit.controller");
class PaymentCommitRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/missing', cors_1.default(), payment_commit_controller_1.paymentCommitController.InsertMissingPyc);
    }
}
exports.PaymentCommitRoute = PaymentCommitRoute;
exports.paymentCommitRoute = new PaymentCommitRoute();
