import { Request, Response } from 'express';

class AliveController {
  // Insertar los cancel históricos en la tabla history_rebill
  public showAlive(req: Request, res: Response): Response {
    return res.send('HotGo Datawarehouse Backend is alive!!').status(200);
  }
}

export const aliveController = new AliveController();