import { AdSlot, communicationService, messageBoxTrackingEvent } from '@wikia/ad-engine';
import { MessageBoxType } from './message-box-service';

export class MessageBox {
	protected type: MessageBoxType;
	protected adSlot: AdSlot;
	protected redirectUrl: string;
	protected buttonText: string;
	protected messageText: string;

	constructor(adSlot: AdSlot) {
		this.adSlot = adSlot;
	}

	create = () => {
		const status_impression = `cm_${this.type.toLowerCase()}_impression`;
		const status_clicked = `cm_${this.type.toLowerCase()}_clicked`;

		const placeholder = this.adSlot.getPlaceholder();
		if (!placeholder) {
			throw new Error(`No placeholder to insert '${this.type}' Message Box`);
		}

		const wrapper = this.createBoxWrapper();
		const message = this.createMessage();
		const button = this.createButton();
		button.onclick = () => {
			this.openInNewTab();
			this.sendTrackingEvent(status_clicked);
		};

		wrapper.append(message, button);
		placeholder.appendChild(wrapper);

		this.sendTrackingEvent(status_impression);
	};

	createBoxWrapper = (): HTMLElement => {
		const box = document.createElement('div');
		box.classList.add('message-box', `cm-${this.type.toLowerCase()}-box`);
		return box;
	};

	createMessage = (): HTMLElement => {
		const message = document.createElement('h3');
		message.className = 'cm-message';
		message.innerHTML = this.messageText;
		return message;
	};

	createButton = (): HTMLButtonElement => {
		const button = document.createElement('button');
		button.classList.add('cm-button', 'wds-button');
		button.innerHTML = this.buttonText;

		return button;
	};

	openInNewTab = (): void => {
		window.open(this.redirectUrl, '_blank').focus();
	};

	sendTrackingEvent = (ad_status: string) => {
		communicationService.dispatch(
			messageBoxTrackingEvent({
				ad_status,
				adSlotName: this.adSlot.getSlotName(),
			}),
		);
	};

	protected buildUrl = (basicUrl: string, utm_campaign: string): string => {
		const utm_source = 'fandom';
		const utm_medium = 'ctr';
		const utm_content = 'button';
		const params = [
			`utm_source=${utm_source}`,
			`utm_medium=${utm_medium}`,
			`utm_campaign=${utm_campaign}`,
			`utm_content=${utm_content}`,
		];

		return basicUrl + params.join('&');
	};
}
