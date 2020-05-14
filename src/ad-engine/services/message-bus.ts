import { logger } from '../utils';

type CallbackFn<T> = (args: T) => void;
interface Match {
	keys?: string[];
	infinite?: boolean;
	origin?: string[];
}
export interface MessageCallback {
	match: Match;
	fn: CallbackFn<any>;
}

const logGroup = 'message-bus';

export class MessageBus {
	private isInitialized = false;
	private callbacks: MessageCallback[] = [];

	constructor(private source: Pick<Window, 'addEventListener'> = window) {}

	init(): void {
		if (this.isInitialized) {
			return;
		}

		logger(logGroup, 'Register message listener');
		this.source.addEventListener(
			'message',
			(message: MessageEvent) => this.onMessage(message),
			false,
		);
		this.isInitialized = true;
	}

	register<T>(match: Match, callback: CallbackFn<T>): void {
		this.init(); // idempotent, can be called with each register call
		this.callbacks.push({
			match,
			fn: callback,
		});
	}

	private onMessage(message: MessageEvent): void {
		let i = 0;
		let callback: MessageCallback;

		if (this.isAdEngineMessage(message)) {
			logger(logGroup, 'Message received', message);

			for (i = 0; i < this.callbacks.length; i += 1) {
				callback = this.callbacks[i];
				if (this.messageMatch(callback.match, message)) {
					logger(logGroup, 'Matching message', message, callback);

					callback.fn(this.getDataFromMessage(message).AdEngine);

					if (!callback.match.infinite) {
						this.callbacks.splice(i, 1);
					}

					return;
				}
			}
		}
	}

	private isAdEngineMessage(message: MessageEvent): boolean {
		const data = this.getDataFromMessage(message);

		return !!data && !!data.AdEngine;
	}

	private messageMatch(match: Match, message: MessageEvent): boolean {
		let matching = true;

		if (match.origin && !match.origin.includes(message.origin)) {
			return false;
		}

		if (match.keys) {
			const data = this.getDataFromMessage(message).AdEngine;

			match.keys.forEach((key) => {
				matching = matching && data[key];
			});
		}

		return matching;
	}

	private getDataFromMessage(message: MessageEvent): any {
		if (typeof message.data === 'string') {
			try {
				return JSON.parse(message.data);
			} catch (e) {
				return undefined;
			}
		}
		return message.data;
	}
}

export const messageBus = new MessageBus();
