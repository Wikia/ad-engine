import { Dictionary } from '../models';
import { outboundTrafficRestrict } from '../utils';
import { context } from './context-service';

class ExternalLogger {
	private readonly isActive: boolean;

	constructor() {
		if (!context.get('services.externalLogger.threshold')) {
			context.set('services.externalLogger.threshold', 1);
		}

		this.isActive = outboundTrafficRestrict.isOutboundTrafficAllowed('externalLogger');
	}

	log(logMessage: string, data: Dictionary = {}): void {
		if (!this.isActive) {
			return;
		}

		const loggerEndpoint = context.get('services.externalLogger.endpoint');

		if (!loggerEndpoint) {
			return;
		}

		const form = new FormData();
		form.set('message', logMessage);

		Object.keys(data).forEach((key: string) => {
			form.set(key, data[key]);
		});

		const request = new XMLHttpRequest();
		request.open('POST', loggerEndpoint, true);
		request.send(form);
	}
}

export const externalLogger = new ExternalLogger();
