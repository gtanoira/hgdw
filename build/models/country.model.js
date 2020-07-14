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
exports.Country = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
let Country = class Country {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Country.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'pais_id', comment: 'Id del país según ISO-9000 de 2 caracteres' }),
    __metadata("design:type", String)
], Country.prototype, "paisId", void 0);
__decorate([
    typeorm_1.Column({ name: 'moneda_id', comment: 'ID de la moneda del país, ej: ARS, CLP, BRL, COP, UYU, etc.' }),
    __metadata("design:type", String)
], Country.prototype, "monedaId", void 0);
__decorate([
    typeorm_1.Column({ name: 'utc_shift', type: 'int', comment: 'Cantidad de horas que hay que sumar o restar al tiempo UTC (estandard)' }),
    __metadata("design:type", Number)
], Country.prototype, "utcShift", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Country.prototype, "descripcion", void 0);
Country = __decorate([
    typeorm_1.Entity({
        name: 'paises',
        database: environment_settings_1.AWS_DBASE,
        synchronize: false
    })
], Country);
exports.Country = Country;
