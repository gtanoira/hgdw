"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleEventsService = exports.ScheduleEventsService = void 0;
const typeorm_1 = require("typeorm");
const schedule_event_model_1 = require("../models/schedule-event.model");
class ScheduleEventsService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = typeorm_1.getConnection('INFORMATION_SCHEMA');
            return yield connection.getRepository(schedule_event_model_1.ScheduleEvent)
                .createQueryBuilder()
                .where('event_schema = :event', { event: 'HGDW' })
                .getMany();
        });
    }
}
exports.ScheduleEventsService = ScheduleEventsService;
exports.scheduleEventsService = new ScheduleEventsService();
