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
exports.errorLogsController = void 0;
const authorization_service_1 = require("../services/authorization.service");
const error_logs_service_1 = require("../services/error-logs.service");
class ErrorLogsController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield authorization_service_1.authorizationService.isTokenValid(req.headers.authorization || '')) {
                return yield error_logs_service_1.errorLogsService.getAll()
                    .then(data => {
                    return res.status(200).send(data);
                })
                    .catch(err => {
                    console.log('*** ERR:', err);
                    return res.status(503).send(err);
                });
            }
            else {
                return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.' });
            }
        });
    }
    check(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield authorization_service_1.authorizationService.isTokenValid(req.headers.authorization || '')) {
                return yield error_logs_service_1.errorLogsService.checkErrors(req.params.userId)
                    .then(data => {
                    return res.status(200).send(data);
                })
                    .catch(err => {
                    console.log('*** ERR:', err);
                    return res.status(503).send(err);
                });
            }
            else {
                return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.' });
            }
        });
    }
}
exports.errorLogsController = new ErrorLogsController();
