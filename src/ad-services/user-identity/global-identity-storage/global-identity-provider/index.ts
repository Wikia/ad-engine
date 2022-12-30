import { utils } from '@ad-engine/core';
import {
	CrossDomainClient,
	IframeMessage,
	Messages,
} from '@fandom-frontend/cross-domain-storage/dist';
import { communicationService, eventsRepository } from '@ad-engine/communication';

export class GlobalIdentityProvider {
	public client: CrossDomainClient;
	private logGroup = 'GlobalIdentityProvider';

	private isFandomUrl(): boolean {
		return window.location.href.includes('.fandom.com');
	}

	private _onMessage(ev: IframeMessage) {
		switch (ev.type) {
			case Messages.PPID_RESPONSE:
				communicationService.emit(eventsRepository.GLOBAL_IDENTITY_RECEIVED, { ppid: ev.payload });
				break;
			default:
				utils.logger(this.logGroup, 'Invalid event: ', ev.type);
				break;
		}
	}

	public sendMessage(messageType: Messages, payload?): void {
		this.client.sendMessage(new IframeMessage(messageType, payload));
	}

	public async initialize(): Promise<void> {
		if (this.isFandomUrl()) {
			utils.logger(this.logGroup, 'disabled');
			return;
		}

		utils.logger(this.logGroup, 'Initializing Global Identity Provider');
		this.client = new CrossDomainClient(this._onMessage.bind(this));
		await this.client.createIframe();
	}
}
