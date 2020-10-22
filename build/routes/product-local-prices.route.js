"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productLocalPricesRoute = exports.ProductLocalPricesRoute = void 0;
const express_1 = require("express");
const cors_1 = __importDefault(require("cors"));
const product_local_prices_controller_1 = require("../controllers/product-local-prices.controller");
class ProductLocalPricesRoute {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', cors_1.default(), product_local_prices_controller_1.productLocalPricesController.index);
    }
}
exports.ProductLocalPricesRoute = ProductLocalPricesRoute;
exports.productLocalPricesRoute = new ProductLocalPricesRoute();
