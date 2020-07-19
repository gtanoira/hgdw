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
const error_logs_route_1 = require("../routes/error-logs.route");
const procesos_batchs_route_1 = require("../routes/procesos-batchs.route");
const schedule_events_route_1 = require("../routes/schedule-events.route");
class ApiServer {
    constructor() {
        this.whiteList = [
            'http://localhost:4200',
            'http://10.4.[0-9]{1,3}.[0-9]{1,3}'
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
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        app.use(morgan_1.default('dev'));
        app.use(cors_1.default(this.corsOptionsDelegate));
        app.use('/api2/procesos_batchs', procesos_batchs_route_1.procesosBatchsRoute.router);
        app.use('/api2/error_logs', error_logs_route_1.errorLogsRoute.router);
        app.use('/api2/schedule_events', schedule_events_route_1.scheduleEventsRoute.router);
        app.set('port', port);
        app.listen(app.get('port'), () => {
            console.log(`Server escuchando en el port`, app.get('port'));
        });
    }
}
exports.ApiServer = ApiServer;
