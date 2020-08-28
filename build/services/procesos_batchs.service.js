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
exports.procesosBatchsService = exports.ProcesosBatchsService = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
const proceso_batch_model_1 = require("../models/proceso_batch.model");
class ProcesosBatchsService {
    delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sqlCmd = `CALL pr_delete_batch(${id})`;
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            return yield connection.query(sqlCmd)
                .then(data => {
                const dataMessage = JSON.stringify(data);
                const rtnMessage = JSON.parse(dataMessage);
                console.log('');
                console.log(rtnMessage[1][0]);
                return rtnMessage[1][0].sqlResult;
            })
                .catch(err => {
                return Promise.reject(err);
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection(environment_settings_1.AWS_DBASE);
            return yield connection.getRepository(proceso_batch_model_1.ProcesoBatch).find();
        });
    }
}
exports.ProcesosBatchsService = ProcesosBatchsService;
exports.procesosBatchsService = new ProcesosBatchsService();
