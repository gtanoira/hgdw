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
const google_analytics_service_1 = require("../services/google-analytics.service");
class GoogleAnalyticsController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield google_analytics_service_1.googleAnalyticsService.getView4()
                .then(rtnValue => {
                console.log('*** rtnValue:');
                console.log(rtnValue);
                return res.send(rtnValue).status(200);
            })
                .catch(err => {
                console.log('*** ERROR CONTOLLER:');
                console.log(err, typeof err);
                return res.send(err.error.message.toString());
            });
        });
    }
}
exports.googleAnalyticsController = new GoogleAnalyticsController();
