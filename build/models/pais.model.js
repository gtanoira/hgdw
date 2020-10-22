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
exports.Pais = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
let Pais = class Pais {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Pais.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Pais.prototype, "country", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Pais.prototype, "currency", void 0);
__decorate([
    typeorm_1.Column({ name: 'utc_shift', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Pais.prototype, "utcShift", void 0);
__decorate([
    typeorm_1.Column({ name: 'descripcion', default: null }),
    __metadata("design:type", String)
], Pais.prototype, "name", void 0);
Pais = __decorate([
    typeorm_1.Entity({
        name: 'countries',
        database: environment_settings_1.AWS_DBASE,
        synchronize: false
    })
], Pais);
exports.Pais = Pais;
