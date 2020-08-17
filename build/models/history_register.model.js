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
exports.HistoryRegister = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
let HistoryRegister = class HistoryRegister {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], HistoryRegister.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'user_id' }),
    __metadata("design:type", String)
], HistoryRegister.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], HistoryRegister.prototype, "event", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], HistoryRegister.prototype, "source", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], HistoryRegister.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], HistoryRegister.prototype, "lastname", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], HistoryRegister.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], HistoryRegister.prototype, "country", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], HistoryRegister.prototype, "idp", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp' }),
    __metadata("design:type", Object)
], HistoryRegister.prototype, "timestamp", void 0);
HistoryRegister = __decorate([
    typeorm_1.Entity({
        name: 'history_register',
        database: environment_settings_1.AWS_DBASE,
        synchronize: false
    })
], HistoryRegister);
exports.HistoryRegister = HistoryRegister;
