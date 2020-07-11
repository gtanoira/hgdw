import { getConnection, DeleteResult } from 'typeorm';

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
}
export const scheduleEventsService = new ScheduleEventsService();
