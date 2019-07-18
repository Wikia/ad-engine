import { logger } from '../utils';

type CallbackFn<T> = (args: T) => void;
interface Match {
	keys?: string[];
	infinite?: boolean;
}
export interface MessageCallback {
	match: Match;
	fn: CallbackFn<any>;
}

const callbacks: MessageCallback[] = [];
const logGroup = 'message-bus';

function isAdEngineMessage(message: any): boolean {
	const data = getDataFromMessage(message);

	return !!data && !!data.AdEngine;
}

function getDataFromMessage(message: any): any {
	if (typeof message.data === 'string') {
		try {
			return JSON.parse(message.data);
		} catch (e) {
			return undefined;
		}
	}
	return message.data;
}

function messageMatch(match: Match, message: MessageEvent): boolean {
	let matching = true;

	if (match.keys) {
		const data = getDataFromMessage(message).AdEngine;

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

				callback.fn(getDataFromMessage(message).AdEngine);

				if (!callback.match.infinite) {
					callbacks.splice(i, 1);
				}

				return;
			}
		}
	}
}

class MessageBus {
	private isInitialized = false;

	init(): void {
		if (this.isInitialized) {
			return;
		}

		logger(logGroup, 'Register message listener');
		window.addEventListener('message', onMessage, false);
		this.isInitialized = true;
	}

	register<T>(match: Match, callback: CallbackFn<T>): void {
		this.init(); // idempotent, can be called with each register call
		callbacks.push({
			match,
			fn: callback,
		});
	}
}

export const messageBus = new MessageBus();
