import { IframeMessage, MessageCallbackSet, StorageStatus, SystemMessages } from './types';
import { iframeMessageFactory } from './iframe-message-factory';

export const protocolVersion = '65464d88d';

export class CrossDomainReceiver {
	private static _instance: CrossDomainReceiver;
	_status: StorageStatus;

	_port: MessagePort;
	_messageCallbacks: MessageCallbackSet = {};
	_onMessageCallback = (message: IframeMessage) => {
		const callback = this._messageCallbacks[message.type];
		if (callback) {
			callback(message);
		} else {
			console.error('Unsupported message type', message);
			return;
		}
	};

	constructor() {
		this._initialize();
	}

	static get Instance(): CrossDomainReceiver {
		return this._instance || (this._instance = new CrossDomainReceiver());
	}

	setActions(messageCallbacks: MessageCallbackSet): void {
		this._messageCallbacks = { ...this._messageCallbacks, ...messageCallbacks };
	}

	get status() {
		return this._status;
	}

	respond(event: IframeMessage) {
		console.log('CrossDomainReceiver: respond', event);
		this._port.postMessage(event);
	}

	_initialize() {
		addEventListener('message', this._onMessage.bind(this), false);
		this._status = StorageStatus.Initializing;
	}

	async _onMessage(ev: MessageEvent) {
		if (this.validateMessage(ev.data)) {
			console.log('CrossDomainReceiver: _onMessage', ev);
			// special case to save the port, this message should be the fist message sent by client
			if (ev.data.type === SystemMessages.REGISTER_REQUEST && ev?.ports?.length === 1) {
				this._port = ev.ports[0];
				this._status = StorageStatus.Ready;

				this.respond(iframeMessageFactory(SystemMessages.REGISTER_RESPONSE, protocolVersion));
			}

			// pass the event down the pipe
			if (typeof this._onMessageCallback === 'function') {
				this._onMessageCallback(ev.data);
			}
		} else {
			console.log('CrossDomainReceiver: _onMessage - invalid message', ev);
		}
	}

	private validateMessage(message: IframeMessage): boolean {
		return message?.xv === protocolVersion;
	}
}

export function initializeCrossDomainStorage(
	messageCallbacks: MessageCallbackSet,
): CrossDomainReceiver {
	if (document.readyState != 'loading') {
		CrossDomainReceiver.Instance.setActions(messageCallbacks);
	} else {
		document.addEventListener('DOMContentLoaded', () => {
			CrossDomainReceiver.Instance.setActions(messageCallbacks);
		});
	}

	return CrossDomainReceiver.Instance;
}
