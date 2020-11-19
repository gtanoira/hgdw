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
exports.PaymentCommitModel = void 0;
const typeorm_1 = require("typeorm");
let PaymentCommitModel = class PaymentCommitModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_id' }),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ name: 'access_until', type: 'timestamp' }),
    __metadata("design:type", Object)
], PaymentCommitModel.prototype, "accessUntil", void 0);
__decorate([
    typeorm_1.Column({ name: 'method_name' }),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "methodName", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "source", void 0);
__decorate([
    typeorm_1.Column({ type: 'double' }),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column({ name: 'payment_type' }),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "paymentType", void 0);
__decorate([
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "duration", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "message", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "event", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp' }),
    __metadata("design:type", Object)
], PaymentCommitModel.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_agent', length: 1024 }),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "userAgent", void 0);
__decorate([
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "discount", void 0);
__decorate([
    typeorm_1.Column({ name: 'payment_id' }),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "paymentId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "package", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinyint' }),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "trial", void 0);
__decorate([
    typeorm_1.Column({ name: 'trial_duration', type: 'int' }),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "trialDuration", void 0);
__decorate([
    typeorm_1.Column({ name: 'is_suscription', type: 'tinyint' }),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "isSuscription", void 0);
__decorate([
    typeorm_1.Column({ type: 'double' }),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "taxableAmount", void 0);
__decorate([
    typeorm_1.Column({ type: 'double' }),
    __metadata("design:type", Number)
], PaymentCommitModel.prototype, "vatAmount", void 0);
__decorate([
    typeorm_1.Column({ name: 'card_type' }),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "cardType", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_payment_id' }),
    __metadata("design:type", String)
], PaymentCommitModel.prototype, "userPaymentId", void 0);
PaymentCommitModel = __decorate([
    typeorm_1.Entity({
        name: 'payment_commit',
        database: 'Datalake',
        synchronize: false
    })
], PaymentCommitModel);
exports.PaymentCommitModel = PaymentCommitModel;
