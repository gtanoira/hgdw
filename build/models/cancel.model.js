"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelModel = void 0;
const typeorm_1 = require("typeorm");
let CancelModel = class CancelModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CancelModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_id' }),
    __metadata("design:type", String)
], CancelModel.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CancelModel.prototype, "source", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CancelModel.prototype, "event", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CancelModel.prototype, "channel", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp' }),
    __metadata("design:type", Object)
], CancelModel.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.Column({ name: 'access_until', type: 'timestamp' }),
    __metadata("design:type", Object)
], CancelModel.prototype, "accessUntil", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_agent', length: 1024 }),
    __metadata("design:type", String)
], CancelModel.prototype, "userAgent", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_payment_id' }),
    __metadata("design:type", String)
], CancelModel.prototype, "userPaymentId", void 0);
CancelModel = __decorate([
    typeorm_1.Entity({
        name: 'cancel',
        database: 'Datalake',
        synchronize: false
    })
], CancelModel);
exports.CancelModel = CancelModel;
