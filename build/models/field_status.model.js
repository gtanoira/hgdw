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
exports.FieldStatus = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
let FieldStatus = class FieldStatus {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FieldStatus.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ comment: 'Valor que viene de las tablas del Datalake' }),
    __metadata("design:type", String)
], FieldStatus.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ name: 'paym_status', comment: 'Resultado que se obtiene del valor dado por status: aprobado / no aprobado' }),
    __metadata("design:type", String)
], FieldStatus.prototype, "paymStatus", void 0);
FieldStatus = __decorate([
    typeorm_1.Entity({
        name: 'field_status',
        database: environment_settings_1.AWS_DBASE,
        synchronize: false
    })
], FieldStatus);
exports.FieldStatus = FieldStatus;
