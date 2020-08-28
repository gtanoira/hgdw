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
exports.cancelService = exports.CancelService = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
class CancelService {
    insertCancelHistory(sqlCmd) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            return yield connection.query(sqlCmd);
        });
    }
}
exports.CancelService = CancelService;
exports.cancelService = new CancelService();
