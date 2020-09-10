"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServer = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cancel_route_1 = require("../routes/cancel.route");
const error_logs_route_1 = require("../routes/error-logs.route");
const google_analytics_route_1 = require("../routes/google-analytics.route");
const procesos_batchs_route_1 = require("../routes/procesos-batchs.route");
const register_route_1 = require("../routes/register.route");
const schedule_events_route_1 = require("../routes/schedule-events.route");
const titles_route_1 = require("../routes/titles.route");
const user_collections_route_1 = require("../routes/user_collections.route");
class ApiServer {
    constructor() {
        this.whiteList = [
            'http://localhost:4200',
            'http://10.4.[0-9]{1,3}.[0-9]{1,3}',
            'http://portaladmin2.claxson.com',
            'http://portaladmin2dev.claxson.com'
        ];
        this.corsOptions = {};
        this.corsOptionsDelegate = (req, callback) => {
            let corsOptions = {
                "origin": false,
                "methods": "GET,PUT,PATCH,POST,DELETE",
                "allowedHeaders": "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Authorization, Content-Type",
                "exposedHeaders": "",
                "preflightContinue": false,
                "optionsSuccessStatus": 200
            };
            if (this.whiteList.indexOf(req.headers.origin) !== -1) {
                corsOptions['origin'] = true;
            }
            else {
                corsOptions['origin'] = false;
            }
            callback(null, corsOptions);
        };
    }
    start(port) {
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        app.use(body_parser_1.default.json({ limit: '10mb' }));
        app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
        app.use(morgan_1.default('dev'));
        app.use(cors_1.default(this.corsOptionsDelegate));
        app.use('/api2/error_logs', error_logs_route_1.errorLogsRoute.router);
        app.use('/api2/procesos_batchs', procesos_batchs_route_1.procesosBatchsRoute.router);
        app.use('/api2/schedule_events', schedule_events_route_1.scheduleEventsRoute.router);
        app.use('/cancel', cancel_route_1.cancelRoute.router);
        app.use('/ga', google_analytics_route_1.googleAnalyticsRoute.router);
        app.use('/register', register_route_1.registerRoute.router);
        app.use('/titles', titles_route_1.titlesRoute.router);
        app.use('/user_collections', user_collections_route_1.userCollectionsRoute.router);
        app.set('port', port);
        app.listen(app.get('port'), () => {
            console.log(`Server escuchando en el port`, app.get('port'));
        });
    }
}
exports.ApiServer = ApiServer;
