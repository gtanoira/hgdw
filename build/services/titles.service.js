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
exports.titlesService = exports.TitlesService = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
class TitlesService {
    insertPublishedTitles(sqlCmd) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield ((_a = this.queryRunner) === null || _a === void 0 ? void 0 : _a.query(sqlCmd));
        });
    }
    startTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('*** START TRANSACTION');
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            this.queryRunner = connection.createQueryRunner();
            yield this.queryRunner.connect();
            yield this.queryRunner.startTransaction();
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
            yield ((_a = this.queryRunner) === null || _a === void 0 ? void 0 : _a.release());
        });
    }
}
exports.TitlesService = TitlesService;
exports.titlesService = new TitlesService();
