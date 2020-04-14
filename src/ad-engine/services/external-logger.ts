import { Dictionary } from '../models';
import { context } from './context-service';

class ExternalLogger {
	log(logMessage: string, data: Dictionary = {}): void {
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
