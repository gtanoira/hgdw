"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerService = exports.LoggerService = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
const error_log_model_1 = require("../models/error-log.model");
class LoggerService {
    crearLogActualizar(errMessage) {
        try {
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            const errorRec = new error_log_model_1.ErrorLog();
            errorRec.errorType = 'actualizar tabla';
            errorRec.message = errMessage;
            connection.getRepository(error_log_model_1.ErrorLog).save(errorRec);
        }
        catch (error) {
            null;
        }
        return;
    }
}
exports.LoggerService = LoggerService;
exports.loggerService = new LoggerService();
