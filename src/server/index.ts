import express, { Request } from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import filesUpload from 'express-fileupload';

// Environment

// Routes
import { cancelRoute } from '../routes/cancel.route';
import { errorLogsRoute } from '../routes/error-logs.route';
import { googleAnalyticsRoute } from '../routes/google-analytics.route';
import { paymentCommitRoute } from '../routes/payment_commit.route';
import { procesosBatchsRoute }  from '../routes/procesos-batchs.route';
import { registerRoute } from '../routes/register.route';
import { scheduleEventsRoute } from '../routes/schedule-events.route';
import { titlesRoute } from '../routes/titles.route';
import { userCollectionsRoute } from '../routes/user_collections.route';

export class ApiServer {

  // CORS origins habilitados a acceder a la app
  private whiteList = [
    'http://portaladmin2.claxson.com',
    'http://10.4.[0-9]{1,3}.[0-9]{1,3}',
    'http://localhost:4200',
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
    console.log('*** CORS - origen:', origen);
    if (this.whiteList.indexOf(origen) !== -1) {
      corsOptions['origin'] = true;  // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions['origin'] = false; // disable CORS for this request
    }

    callback(null, corsOptions); // callback expects two parameters: error and options
    
    console.log('*** CORS - corsOptions:', corsOptions);
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

    // File uploads
    app.use(filesUpload({
      abortOnLimit: true,   // devuelve un status 413 - Size exceeded
      safeFileNames: false,  // guarda el archivo con el mismo nombre 
      preserveExtension: false   // mantener la extensión
    }));

    // Http reqeusts log
    app.use(morgan('dev'))

    // CORS
    app.use(cors(this.corsOptionsDelegate));
    
    /*
     * Routes
     */
    app.use('/api2/error_logs', errorLogsRoute.router);
    app.use('/api2/cancel', cancelRoute.router);
    app.use('/api2/payment_commit', paymentCommitRoute.router);
    app.use('/api2/procesos_batchs', procesosBatchsRoute.router);
    app.use('/api2/register', registerRoute.router);
    app.use('/api2/schedule_events', scheduleEventsRoute.router);
    app.use('/cancel', cancelRoute.router);
    app.use('/ga', googleAnalyticsRoute.router);
    app.use('/titles', titlesRoute.router);
    app.use('/user_collections', userCollectionsRoute.router);


    // Starting the Server
    app.set('port', port);
    app.listen(app.get('port'), () => {
        console.log(`Server escuchando en el port`, app.get('port'));
    });

  }

}