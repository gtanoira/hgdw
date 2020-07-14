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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToTimeZone = void 0;
const typeorm_1 = require("typeorm");
const moment_1 = __importDefault(require("moment"));
const environment_settings_1 = require("../settings/environment.settings");
const country_model_1 = require("../models/country.model");
function ToTimeZone(datetimeUtc, country) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            const hsShift = yield connection.getRepository(country_model_1.Country).findOne({ paisId: country.toUpperCase() })
                .then(data => data ? data.utcShift : 0)
                .catch(error => 0);
            return moment_1.default(datetimeUtc, 'YYYY-MM-DDThh:mm:ss').add(hsShift, 'hours').format('YYYY-MM-DDThh:mm:ss');
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}
exports.ToTimeZone = ToTimeZone;
