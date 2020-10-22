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
exports.paisesController = void 0;
const paises_service_1 = require("../services/paises.service");
const authorization_service_1 = require("../services/authorization.service");
class PaisesController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield authorization_service_1.authorizationService.isTokenValid(req.headers.authorization || '')) {
                const recs = yield paises_service_1.paisesService.getAll();
                return res.status(200).send(recs);
            }
            else {
                return res.status(401).send({ 'message': 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.' });
            }
        });
    }
}
exports.paisesController = new PaisesController();