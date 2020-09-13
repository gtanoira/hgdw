import express, { Request } from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

// Routes
import { cancelRoute } from '../routes/cancel.route';
import { errorLogsRoute } from '../routes/error-logs.route';
import { googleAnalyticsRoute } from '../routes/google-analytics.route';
import { procesosBatchsRoute }  from '../routes/procesos-batchs.route';
import { registerRoute } from '../routes/register.route';
import { scheduleEventsRoute } from '../routes/schedule-events.route';
import { titlesRoute } from '../routes/titles.route';
import { userCollectionsRoute } from '../routes/user_collections.route';

export class ApiServer {

  // CORS origins habilitados a acceder a la app
  private whiteList = [
    'http://localhost:4200',
    'http://10.4.[0-9]{1,3}.[0-9]{1,3}',
    'http://portaladmin2.claxson.com',
    'http://portaladmin2dev.claxson.com'
  ];
  
  // CORS validador del origin del HTTP request
  private corsOptions = {};
  private corsOptionsDelegate = (req: Request, callback: CallableFunction)  => {
    // Default options for all routes
    const corsOptions = {
      "origin": false,
      "methods": "GET,PUT,PATCH,POST,DELETE",
      "allowedHeaders": "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Authorization, Content-Type",
      "exposedHeaders": "",
      "preflightContinue": false,
      "optionsSuccessStatus": 200
    };
    
    const origen = req.headers.origin ? req.headers.origin : 'xxx';
    if (this.whiteList.indexOf(origen) !== -1) {
      corsOptions['origin'] = true;  // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions['origin'] = false; // disable CORS for this request
    }
    callback(null, corsOptions); // callback expects two parameters: error and options
    return corsOptions;
  }

  public start(port: number): void {

    const app = express();

    /*
    * Middlewares Section
    * OJO: es super importante el orden de ejecución de cada paquete o funcion o middleware
    */
    /* app.use(express.json());
    app.use(express.urlencoded({ extended: false })); */

    // Static files
    app.use('/static', express.static(path.join(__dirname, 'public')));

    // MAX legth para el body en los request
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));  // se usa para formatear los forms <FORM></FORM>

    // Http reqeusts log
    app.use(morgan('dev'))

    // CORS
    app.use(cors(this.corsOptionsDelegate));
    
    /*
     * Routes
     */
    app.use('/api2/error_logs', errorLogsRoute.router);
    app.use('/api2/procesos_batchs', procesosBatchsRoute.router);
    app.use('/api2/schedule_events', scheduleEventsRoute.router);
    app.use('/cancel', cancelRoute.router);
    app.use('/ga', googleAnalyticsRoute.router);
    app.use('/register', registerRoute.router);
    app.use('/titles', titlesRoute.router);
    app.use('/user_collections', userCollectionsRoute.router);


    // Starting the Server
    app.set('port', port);
    app.listen(app.get('port'), () => {
        console.log(`Server escuchando en el port`, app.get('port'));
    });

  }

}