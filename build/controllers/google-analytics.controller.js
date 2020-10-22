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
exports.googleAnalyticsController = void 0;
const authorization_service_1 = require("../services/authorization.service");
const excel_exporter_service_1 = require("../services/excel-exporter.service");
const google_analytics_service_1 = require("../services/google-analytics.service");
class GoogleAnalyticsController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield google_analytics_service_1.googleAnalyticsService.getView4('', '', '', '')
                .then(rtnValue => {
                excel_exporter_service_1.excelExporterService.exportAsExcelFile(rtnValue.rows, 'GA_cobros_');
                const a = [
                    {
                        "user": "AR_hotgo_19571545",
                        "ttsId": "20201020064146AR_hotgo_19571545",
                        "pais": "AR",
                        "medioPago": "Tarjeta de Crédito",
                        "moneda": "ARS",
                        "importe": "3.868141"
                    }, {
                        "user": "AR_hotgo_22043653",
                        "ttsId": "20201015042525AR_hotgo_22043653",
                        "pais": "AR",
                        "medioPago": "Tarjeta de Crédito",
                        "moneda": "ARS",
                        "importe": "12.785305"
                    }
                ];
                excel_exporter_service_1.excelExporterService.exportAsExcelFile(a, 'GA_cobros_');
                return res.send(rtnValue).status(200);
            })
                .catch(err => {
                console.log('*** ERROR CONTOLLER:');
                console.log(err, typeof err);
                return res.send(err.error.message.toString());
            });
        });
    }
    getData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield authorization_service_1.authorizationService.isTokenValid(req.headers.authorization || '')) {
                console.log('*** REQ.QUERY:', req.query);
                const metrics = req.query.metrics ? req.query.metrics.toString() : '';
                const dimensions = req.query.dimensions ? req.query.dimensions.toString() : '';
                const fechaDesde = req.query.fechadesde ? req.query.fechadesde.toString() : '';
                const fechaHasta = req.query.fechahasta ? req.query.fechahasta.toString() : '';
                return yield google_analytics_service_1.googleAnalyticsService.getView4(metrics, dimensions, fechaDesde, fechaHasta)
                    .then(rtnValue => {
                    return res.status(200).send(rtnValue);
                })
                    .catch(err => {
                    console.log('*** ERROR CONTOLLER:');
                    console.log(err);
                    return res.status(500).send({ message: err.toString() });
                });
            }
            else {
                return res.status(401).send({ message: 'HTG-003(E): el token del usuario es inválido o ha expirado. Vuelva a loguearse.' });
            }
        });
    }
}
exports.googleAnalyticsController = new GoogleAnalyticsController();
