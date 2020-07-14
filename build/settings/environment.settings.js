"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PORT = exports.LOGIN_CENTRAL_SERVER = exports.AWS_DBASE = exports.SAPGW_SERVER = exports.EMAILS_POR_ACTUALIZACON = exports.EMAIL_SERVER_SETTINGS = void 0;
exports.EMAIL_SERVER_SETTINGS = {
    host: 'clxmail01.claxson.com',
    port: 25,
    auth: {
        user: 'uu',
        pass: 'iuu'
    },
    fromAddress: 'itcorp@claxson.com',
    SmtpServerConnectionString: `smtp://hotgo@claxson.com:hotgo_**34@clxmail01.claxson.com`,
    GmailSmtpServer: 'smtps://gonzalo.mtanoira@gmail.com:WalkingTheNow@smtp.gmail.com'
};
exports.EMAILS_POR_ACTUALIZACON = 'itcorp@claxson.com, gonzalo.mtanoira@gmail.com';
exports.SAPGW_SERVER = 'http://clxsapjgw01:8080/ClxWebService';
exports.AWS_DBASE = 'HGDW';
exports.LOGIN_CENTRAL_SERVER = 'http://logincentraldev.claxson.com';
exports.SERVER_PORT = 5000;
