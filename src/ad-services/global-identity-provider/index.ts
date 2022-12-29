import { Injectable } from '@wikia/dependency-injection';
import { DiProcess, utils } from '@ad-engine/core';
import { MessageType } from './messages';
import { IframeMessage, CrossDomainClient } from '@fandom-frontend/cross-domain-storage/dist';

@Injectable({ scope: 'Singleton' })
export class GlobalIdentityProvider implements DiProcess {
	private logGroup = 'GlobalIdentityProvider';
	private client: CrossDomainClient;

	private isFandomUrl(): boolean {
		return window.location.href.includes('.fandom.com');
	}

	private isEnabled(): boolean {
		return !this.isFandomUrl();
	}

	private _onMessage(ev: MessageEvent) {
		utils.logger(this.logGroup, 'got answer', ev);
		switch (ev.type) {
			case MessageType.PPID_RESPONSE:
				utils.logger(this.logGroup, 'Received PPID', ev);
				break;
			default:
				utils.logger(this.logGroup, 'Invalid event: ', ev.type);
				break;
		}
	}

	async execute(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(this.logGroup, 'disabled');
			return;
		}

		utils.logger(this.logGroup, 'Initializing Global Identity Provider');

		this.client = new CrossDomainClient(this._onMessage.bind(this));
		await this.client.createIframe();
		this.client.sendMessage(new IframeMessage(MessageType.PPID_REQUEST));
	}
}
