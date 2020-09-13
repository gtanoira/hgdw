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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationService = void 0;
const axios_1 = __importDefault(require("axios"));
const environment_settings_1 = require("../settings/environment.settings");
class AuthorizationService {
    constructor() {
        this.http = axios_1.default;
    }
    isTokenValid(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.http.get(`${environment_settings_1.LOGIN_CENTRAL_SERVER}/api2/validatesession`, {
                headers: {
                    Authorization: token
                }
            })
                .then(() => { return true; })
                .catch(() => { return false; });
        });
    }
}
exports.authorizationService = new AuthorizationService();
