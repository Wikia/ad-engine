// @ts-strict-ignore
import { communicationService, eventsRepository, type AdSlot } from '@wikia/ad-engine';
import type { MessageBoxType } from './message-box-type';

type MessageBoxEvents =
	| 'cm_register_impression'
	| 'cm_register_clicked'
	| 'cm_fanlab_impression'
	| 'cm_fanlab_clicked'
	| 'cm_newsletter_form_impression'
	| 'cm_newsletter_form_clicked'
	| 'cm_newsletter_link_impression'
	| 'cm_newsletter_link_clicked';

export class MessageBox {
	protected type: MessageBoxType;
	protected adSlot: AdSlot;
	protected buttonText: string;
	protected messageText: string;
	protected statusImpression: MessageBoxEvents;
	protected statusClicked: MessageBoxEvents;
	protected redirectUrl?: string;

	constructor(adSlot: AdSlot) {
		this.adSlot = adSlot;
	}

	create(): void {
		const placeholder = this.createPlaceholder();

		const wrapper = this.createBoxWrapper();
		const message = this.createMessage();
		const elements = this.getElementsToAppend();
		wrapper.append(message);
		elements?.map((element) => wrapper.append(element));

		placeholder.appendChild(wrapper);
		placeholder.classList.add('has-message-box');
		this.sendTrackingEvent(this.statusImpression);
	}

	getElementsToAppend(): HTMLElement[] {
		return [this.createButton()];
	}

	createPlaceholder(): HTMLElement {
		const placeholder = this.adSlot.getPlaceholder();
		if (!placeholder) {
			throw new Error(`No placeholder to insert '${this.type}' Message Box`);
		}

		return placeholder;
	}

	createBoxWrapper(): HTMLElement {
		const box = document.createElement('div');
		box.classList.add('message-box', `cm-${this.type.toLowerCase()}-box`);
		return box;
	}

	createMessage(): HTMLElement {
		const message = document.createElement('h3');
		message.className = 'cm-message';
		message.innerHTML = this.messageText;
		return message;
	}

	createButton(): HTMLButtonElement {
		const button = document.createElement('button');
		button.classList.add('cm-button', 'wds-button');
		button.innerHTML = this.buttonText;

		button.onclick = () => {
			this.openInNewTab();
			this.sendTrackingEvent(this.statusClicked);
		};

		return button;
	}

	openInNewTab(): void {
		window.open(this.redirectUrl, '_blank').focus();
	}

	sendTrackingEvent(ad_status: string): void {
		communicationService.emit(eventsRepository.AD_ENGINE_MESSAGE_BOX_EVENT, {
			ad_status,
			adSlotName: this.adSlot.getSlotName(),
		});
	}

	protected buildUrl(basicUrl: string, utm_campaign: string): string {
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
	}
}
