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
exports.ProcesoBatch = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
let ProcesoBatch = class ProcesoBatch {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProcesoBatch.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'ultimo_timestamp_lote', type: 'timestamp' }),
    __metadata("design:type", String)
], ProcesoBatch.prototype, "ultimoTimestampLote", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ProcesoBatch.prototype, "tabla", void 0);
__decorate([
    typeorm_1.Column({ length: 1000 }),
    __metadata("design:type", String)
], ProcesoBatch.prototype, "resultado", void 0);
__decorate([
    typeorm_1.Column({ name: 'id_fk', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], ProcesoBatch.prototype, "idFk", void 0);
__decorate([
    typeorm_1.Column({ name: 'alta_date', type: 'timestamp', default: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", String)
], ProcesoBatch.prototype, "altaDate", void 0);
__decorate([
    typeorm_1.Column({ name: 'alta_user' }),
    __metadata("design:type", String)
], ProcesoBatch.prototype, "altaUser", void 0);
ProcesoBatch = __decorate([
    typeorm_1.Entity({
        name: 'procesos_batchs',
        database: environment_settings_1.AWS_DBASE,
        synchronize: false
    })
], ProcesoBatch);
exports.ProcesoBatch = ProcesoBatch;
