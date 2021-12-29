import * as EventEmitter from 'eventemitter3';
import { logger } from '../utils';

const groupName = 'eventService';

/**
 * @deprecated For new actions use CommunicationService instead.
 */
class EventService extends EventEmitter.EventEmitter {
	constructor() {
		super();
	}

	emit(event: symbol | string, ...args: any[]): boolean {
		logger(groupName, 'emit', event, ...args);
		return super.emit(event, ...args);
	}
}

/**
 * @deprecated For new actions use communicationService instead.
 */
export const eventService = new EventService();
