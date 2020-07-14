"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auxiliarTablesService = exports.AuxiliarTablesService = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
const field_status_model_1 = require("../models/field_status.model");
const country_model_1 = require("../models/country.model");
class AuxiliarTablesService {
    constructor() {
        this.paises = [];
        this.fieldStatus = [];
    }
    getPaymStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.fieldStatus || this.fieldStatus.length <= 0) {
                yield this.getFieldStatus().then(data => this.fieldStatus = data);
            }
            const recFind = this.fieldStatus.find(el => el.status === status);
            return recFind ? recFind.paymStatus : null;
        });
    }
    getFieldStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            return yield connection.getRepository(field_status_model_1.FieldStatus).find();
        });
    }
    getMonedaPais(country) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.paises) {
                yield this.getPaises().then(data => this.paises = data);
            }
            const recFind = this.paises.find(registro => registro.paisId === country);
            return recFind ? recFind.monedaId : null;
        });
    }
    getPaises() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            return yield connection.getRepository(country_model_1.Country).find();
        });
    }
}
exports.AuxiliarTablesService = AuxiliarTablesService;
exports.auxiliarTablesService = new AuxiliarTablesService();
