import { IframeMessage, iframeMessageFactory, SystemMessages } from '../cross-domain-host';

export class CrossDomainClient {
	fandomIframe: HTMLIFrameElement;
	_onMessage;
	_url;
	private origin: string;
	public resolveIframeInitializing;
	private _context: any;
	private iframeId = 'fandom-iframe';

	constructor(url: string, messageCallback: (message: MessageEvent) => void, calbackContext: any) {
		this._url = url;
		this._context = calbackContext;
		this._onMessage = messageCallback;
		this.origin = 'https://www.fandom.com';
	}

	private onIframeLoaded() {
		const channel = new MessageChannel();
		channel.port1.onmessage = (ev) => {
			if (ev.data.type === SystemMessages.REGISTER_RESPONSE) {
				this.resolveIframeInitializing && this.resolveIframeInitializing();
			}

			return this._onMessage.bind(this._context || this);
		};

		this.sendMessage(iframeMessageFactory(SystemMessages.REGISTER_REQUEST), [channel.port2]);
	}

	public createIframe(): Promise<void> {
		const element = document.getElementById(this.iframeId);
		if (element) {
			return Promise.resolve();
		} else {
			return new Promise<void>((res) => {
				this.resolveIframeInitializing = res;
				const iframe: any = document.createElement('iframe');
				iframe.id = this.iframeId;
				iframe.style.display = 'none';
				iframe.sandbox = 'allow-same-origin allow-scripts';
				iframe.addEventListener('load', this.onIframeLoaded.bind(this));
				iframe.addEventListener('error', () => {
					console.error('Cross domain iframe loading failed');
				});
				iframe.src = this._url;
				this.fandomIframe = iframe;
				document.body.appendChild(iframe);
			});
		}
	}

	public sendMessage(message: IframeMessage, transfer?: Transferable[]) {
		this.fandomIframe.contentWindow.postMessage(message, this.origin, transfer);
	}
}
