import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';

// Routes
import { procesosBatchsRoute }  from '../routes/procesos-batchs.route';

export class ApiServer {

  public start(port: number): void {

    const app = express();

    // Middlewares
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    // Http reqeusts log
    app.use(morgan('dev'))
    
    // Routes
    app.use('/procesos_batchs', procesosBatchsRoute.router);

    // Static files
    app.use(express.static(path.join(__dirname, 'public')));

    // Starting the Server
    app.set('port', process.env.PORT || port);
    app.listen(app.get('port'), () => {
        console.log(`Server on port`, app.get('port'));
    });

  }

}