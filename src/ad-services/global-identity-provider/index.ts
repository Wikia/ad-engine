import { Injectable } from '@wikia/dependency-injection';
import { DiProcess, utils } from '@ad-engine/core';
import { IframeMessage } from './types';

@Injectable({ scope: 'Singleton' })
export class GlobalIdentityProvider implements DiProcess {
	private logGroup = 'GlobalIdentityProvider';
	private fandomIframe: HTMLIFrameElement;
	private origin: string;

	private isFandomUrl(): boolean {
		return window.location.href.includes('.fandom.com');
	}

	private isEnabled(): boolean {
		return !this.isFandomUrl();
	}

	private _onMessage(ev: MessageEvent) {
		utils.logger(this.logGroup, ev);
	}

	private onIframeLoaded() {
		const channel = new MessageChannel();
		channel.port1.onmessage = this._onMessage;
	}

	private createIframe(url): Promise<void> {
		return new Promise((res, rej) => {
			this.origin = 'https://harrypotter.fandom.com';
			const iframe = document.createElement('iframe');
			iframe.id = 'fandom-iframe';
			iframe.style.display = 'none';
			iframe.addEventListener('load', () => {
				this.onIframeLoaded();
				utils.logger(this.logGroup, 'IFrame loaded');
				res();
			});
			iframe.addEventListener('error', () => {
				utils.logger(this.logGroup, 'IFrame loaded');
				rej();
			});
			iframe.src = url;
			this.fandomIframe = iframe;
			document.body.appendChild(iframe);
		});
	}

	private sendMessage(message: IframeMessage) {
		utils.logger(this.logGroup, 'Sending message ' + message.type);
		this.fandomIframe.contentWindow.postMessage(message, this.origin);
	}

	async execute(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(this.logGroup, 'disabled');
			return;
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore

		utils.logger(this.logGroup, 'Initializing Global Identity Provider');
		await this.createIframe('https://www.fandom.com/silver-surfer.html');
		this.sendMessage({
			type: 'CrossDomain::Register::Request',
			timestamp: Date.now(),
			payload: undefined,
			xv: '6af7f62fe',
		});
	}
}
