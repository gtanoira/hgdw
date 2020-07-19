import { getConnection } from 'typeorm';

// Envirnoment
import { AWS_DBASE } from '../settings/environment.settings';

// Models
import { ScheduleEvent } from '../models/schedule-event.model';

export class ScheduleEventsService {

  public async getAll():Promise<any[]> {
    const connection = getConnection('INFORMATION_SCHEMA');
    return await connection.getRepository(ScheduleEvent)
      .createQueryBuilder()
      .where('event_schema = :event', {event: 'HGDW'})
      .getMany();
  }

  // Modificar un evento de la bdatos en AWS
  public async patchEvent(eventName: string, intervalValue: number, intervalTime: string):Promise<any[]> {
    const connection = getConnection(AWS_DBASE);
    const sqlCmd = `ALTER EVENT evt_update_${eventName} ON SCHEDULE EVERY ${intervalValue} ${intervalTime} STARTS NOW()`;
    return await connection.query(sqlCmd);
  }
}
export const scheduleEventsService = new ScheduleEventsService();
