import { logger } from '../utils';

type CallbackFn = (...args: any[]) => void;
interface Match {
	keys?: string[];
	infinite?: boolean;
}
export interface MessageCallback {
	match: Match;
	fn: CallbackFn;
}

const callbacks: MessageCallback[] = [];
const logGroup = 'message-bus';

function isAdEngineMessage(message: any): boolean {
	try {
		return !!JSON.parse(message.data).AdEngine;
	} catch (e) {
		return false;
	}
}

function messageMatch(match: Match, message: MessageEvent): boolean {
	let matching = true;

	if (match.keys) {
		const data = JSON.parse(message.data).AdEngine;

		match.keys.forEach((key) => {
			matching = matching && data[key];
		});
	}

	return matching;
}

function onMessage(message: MessageEvent): void {
	let i = 0;
	let callback: MessageCallback;

	if (isAdEngineMessage(message)) {
		logger(logGroup, 'Message received', message);

		for (i = 0; i < callbacks.length; i += 1) {
			callback = callbacks[i];
			if (messageMatch(callback.match, message)) {
				logger(logGroup, 'Matching message', message, callback);

				callback.fn(JSON.parse(message.data).AdEngine);

				if (!callback.match.infinite) {
					callbacks.splice(i, 1);
				}

				return;
			}
		}
	}
}

class MessageBus {
	init(): void {
		logger(logGroup, 'Register message listener');
		window.addEventListener('message', onMessage);
	}

	register(match: Match, callback: CallbackFn): void {
		callbacks.push({
			match,
			fn: callback,
		});
	}
}

export const messageBus = new MessageBus();
