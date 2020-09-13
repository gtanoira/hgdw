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
exports.HotGoDBase = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
const error_log_model_1 = require("../models/error-log.model");
const field_status_model_1 = require("../models/field_status.model");
const country_model_1 = require("../models/country.model");
const proceso_batch_model_1 = require("../models/proceso_batch.model");
const schedule_event_model_1 = require("../models/schedule-event.model");
class HotGoDBase {
    static setConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionInformationSchemaOptions = yield typeorm_1.getConnectionOptions('INFORMATION_SCHEMA');
            if (!connectionInformationSchemaOptions) {
                throw new Error(`Las credenciales para la BDatos HotGo (schema: INFORMATION_SCHEMA) no existen.`);
            }
            Object.assign(connectionInformationSchemaOptions, {
                entities: [
                    schedule_event_model_1.ScheduleEvent
                ]
            });
            const connectionAWS_DBASEOptions = yield typeorm_1.getConnectionOptions(environment_settings_1.AWS_DBASE);
            if (!connectionAWS_DBASEOptions) {
                throw new Error(`Las credenciales para la BDatos HotGo (schema: ${environment_settings_1.AWS_DBASE}) no existen.`);
            }
            Object.assign(connectionAWS_DBASEOptions, {
                entities: [
                    error_log_model_1.ErrorLog,
                    field_status_model_1.FieldStatus,
                    country_model_1.Country,
                    proceso_batch_model_1.ProcesoBatch
                ]
            });
            const options = [];
            options.push(connectionAWS_DBASEOptions);
            options.push(connectionInformationSchemaOptions);
            this.connections = yield typeorm_1.createConnections(options)
                .then(() => {
                return this.connections;
            })
                .catch(error => {
                console.log('*** ERROR al iniciar las conecciones a las bases de datos');
                console.log(error);
                return null;
            });
        });
    }
}
exports.HotGoDBase = HotGoDBase;
