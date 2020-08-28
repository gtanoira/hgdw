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
exports.ErrorLog = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
let ErrorLog = class ErrorLog {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ErrorLog.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'error_type', comment: 'Tipo de proceso que generó el error' }),
    __metadata("design:type", String)
], ErrorLog.prototype, "errorType", void 0);
__decorate([
    typeorm_1.Column({ length: 4000, comment: 'Mensaje de error' }),
    __metadata("design:type", String)
], ErrorLog.prototype, "message", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', comment: 'Dia y hora en que se grabó el error' }),
    __metadata("design:type", String)
], ErrorLog.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.Column({ name: 'error_code', comment: 'Tipo de error' }),
    __metadata("design:type", String)
], ErrorLog.prototype, "errorCode", void 0);
__decorate([
    typeorm_1.Column({ name: 'error_solved', type: 'tinyint', comment: 'Solucionado' }),
    __metadata("design:type", Number)
], ErrorLog.prototype, "errorSolved", void 0);
__decorate([
    typeorm_1.Column({ name: 'id_fk', type: 'int', comment: 'Id registro de la tabla donde se produjo el error. (foreign key)' }),
    __metadata("design:type", Number)
], ErrorLog.prototype, "idFk", void 0);
ErrorLog = __decorate([
    typeorm_1.Entity({
        name: 'error_logs',
        database: environment_settings_1.AWS_DBASE,
        synchronize: false
    })
], ErrorLog);
exports.ErrorLog = ErrorLog;
