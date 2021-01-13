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
exports.googleAnalyticsService = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const google_auth_library_2 = require("google-auth-library");
const HGDW_97ad94690664_json_1 = __importDefault(require("../settings/HGDW-97ad94690664.json"));
class GoogleAnalyticsService {
    constructor() {
        this.http = axios_1.default;
        this.jwt = jsonwebtoken_1.default;
        this.googleApis = googleapis_1.google;
        this.analytics = googleapis_1.google.analytics('v3');
        this.accountId = '47530604';
        this.webPropertyId = 'UA-47530604-2';
        this.profileId = '156035551';
    }
    getView3() {
        return __awaiter(this, void 0, void 0, function* () {
            const scopes = [
                'https://www.googleapis.com/auth/analytics',
                'https://www.googleapis.com/auth/analytics.readonly'
            ];
            const jwtServiceAccount = new google_auth_library_1.JWT({
                email: HGDW_97ad94690664_json_1.default.client_email,
                key: HGDW_97ad94690664_json_1.default.private_key,
                scopes
            });
            const gauthServiceAccount = new google_auth_library_2.GoogleAuth({
                clientOptions: jwtServiceAccount
            });
            return jwtServiceAccount.authorize((err, result) => {
                const view_id = '156035551';
                this.googleApis.options({ auth: jwtServiceAccount });
                this.analytics.data.ga.get({
                    ids: `ga:${view_id}`,
                    'start-date': '7daysAgo',
                    'end-date': 'today',
                    metrics: 'ga:pageviews'
                }).then(gaData => {
                    console.log('*** GA DATA:');
                    console.log(gaData);
                    return gaData.data;
                }).catch(err => {
                    console.log(err);
                    return err;
                });
            });
        });
    }
    getView4(metrics, dimensions, fechaDesde, fechaHasta, filters, pageIndex = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = new google_auth_library_2.GoogleAuth({
                keyFilename: 'settings/HGDW-97ad94690664.json',
                projectId: HGDW_97ad94690664_json_1.default.project_id,
                scopes: [
                    'https://www.googleapis.com/auth/analytics',
                    'https://www.googleapis.com/auth/analytics.readonly',
                ]
            });
            const view_id = '156035551';
            const gaOptions = {
                ids: `ga:${view_id}`,
                'start-date': fechaDesde,
                'end-date': fechaHasta,
                'max-results': 10000,
                'start-index': (pageIndex < 1) ? 1 : (pageIndex - 1) * 10000 + 1
            };
            if (metrics) {
                gaOptions['metrics'] = metrics;
            }
            else {
                gaOptions['metrics'] = 'ga:sessions';
            }
            if (dimensions) {
                gaOptions['dimensions'] = dimensions;
            }
            if (filters) {
                gaOptions['filters'] = filters;
            }
            this.googleApis.options({ auth: auth });
            return yield this.analytics.data.ga.get(gaOptions).then(gaData => {
                return gaData.data;
            }).catch(err => {
                console.log('** GA ERROR:');
                console.log(err);
                return Promise.reject(err.errors[0].message);
            });
        });
    }
}
exports.googleAnalyticsService = new GoogleAnalyticsService();
