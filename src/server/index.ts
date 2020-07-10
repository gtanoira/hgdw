import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';
import * as cors from 'cors';

// Routes
import { procesosBatchsRoute }  from '../routes/procesos-batchs.route';

export class ApiServer {

  // CORS origins habilitados a acceder a la app
  private whiteList = [
    'http://localhost:4200',
    'http://10.4.[0-9]{1,3}.[0-9]{1,3}'
  ];
  // CORS validador del origin del HTTP request
  private corsOptionsDelegate = (req, callback) => {
    // Default options for all routes
    let corsOptions = {
      "methods": "GET,PUT,POST,DELETE",
      "allowedHeaders": "Access-Control-Allow-Origin, Access-Control-Allow-Headers",
      "exposedHeaders": "Authorization",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    };
    if (this.whiteList.indexOf(req.header('Origin')) !== -1) {
      corsOptions['origin'] = true;  // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions['origin'] = false; // disable CORS for this request
    }
    console.log('*** REQ:', req);
    callback(null, corsOptions) // callback expects two parameters: error and options
  }

  public start(port: number): void {

    const app = express();

    /*
    * Middlewares Section
    * OJO: es super importante el orden de ejecución de cada paquete o funcion o middleware
    */
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Http reqeusts log
    app.use(morgan('dev'))

    // CORS
    app.use(cors(this.corsOptionsDelegate));
    
    // Routes
    app.use('/procesos_batchs', procesosBatchsRoute.router);

    // Starting the Server
    app.set('port', process.env.PORT || port);
    app.listen(app.get('port'), () => {
        console.log(`Server escuchando en el port`, app.get('port'));
    });

  }

}