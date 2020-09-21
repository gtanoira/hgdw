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
exports.registerService = exports.RegisterService = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
const error_logs_service_1 = require("./error-logs.service");
class RegisterService {
    insertRegisterHistory(sqlCmd) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            return yield connection.query(sqlCmd);
        });
    }
    insertMissingRegister(sqlCmd) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection('Datalake');
            return yield connection.query(sqlCmd);
        });
    }
    deleteDuplicates(userId, cantidad) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlCmd = `DELETE FROM Datalake.register WHERE user_id = '${userId}' LIMIT ${cantidad - 1}`;
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            return yield connection.query(sqlCmd)
                .then(data => {
                return data;
            })
                .catch(err => {
                error_logs_service_1.errorLogsService.addError('del_duplicate_register', err.toString().substring(0, 4000), 'nocode', 0);
                return Promise.reject(err);
            });
        });
    }
    startTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('*** START TRANSACTION');
            const connection = typeorm_1.getConnection('Datalake');
            this.queryRunner = connection.createQueryRunner();
            yield this.queryRunner.connect();
            return yield this.queryRunner.startTransaction();
        });
    }
    commitTransaction() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('*** COMMIT');
            return yield ((_a = this.queryRunner) === null || _a === void 0 ? void 0 : _a.commitTransaction());
        });
    }
    rollbackTransaction() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('*** ROLLBACK');
            return yield ((_a = this.queryRunner) === null || _a === void 0 ? void 0 : _a.rollbackTransaction());
        });
    }
    endTransaction() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('*** END TRANSACTION');
            return yield ((_a = this.queryRunner) === null || _a === void 0 ? void 0 : _a.release());
        });
    }
}
exports.RegisterService = RegisterService;
exports.registerService = new RegisterService();
