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
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const environment_settings_1 = require("../settings/environment.settings");
class EmailService {
    constructor() {
        this._transporter = nodemailer_1.default.createTransport(environment_settings_1.EMAIL_SERVER_SETTINGS.SmtpServerConnectionString);
    }
    sendMail(to, subject, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                from: environment_settings_1.EMAIL_SERVER_SETTINGS.fromAddress,
                to: to,
                subject: subject,
                text: content
            };
            let rtnMessage = '';
            this._transporter.sendMail(options, (error, info) => {
                if (error) {
                    console.log(`error: ${error}`);
                    rtnMessage = `Email error: ${error}`;
                }
                console.log(`Message Sent ${info.response}`);
                rtnMessage = `Message Sent ${info.response}`;
            });
            return rtnMessage;
        });
    }
}
exports.emailService = new EmailService();
