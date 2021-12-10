import { AdSlot, communicationService, hideMessageBoxEvent } from '@wikia/ad-engine';
import { MessageBoxType } from './message-box-service';

export class MessageBox {
	protected type: MessageBoxType;
	protected redirectUrl: string;
	protected buttonText: string;
	protected messageText: string;

	createBoxWrapper = (): HTMLElement => {
		const box = document.createElement('div');
		box.classList.add('message-box', `cm-${this.type.toLowerCase()}-box`);
		return box;
	};

	createMessage = (): HTMLElement => {
		const message = document.createElement('h3');
		message.className = 'cta-message';
		message.innerHTML = this.messageText;
		return message;
	};

	createButton = (): HTMLButtonElement => {
		const button = document.createElement('button');
		button.classList.add('cta-button', 'wds-button');
		button.innerHTML = this.buttonText;

		return button;
	};

	openInNewTab = (): void => {
		window.open(this.redirectUrl, '_blank').focus();
	};

	sendTrackingEvent = (adSlot: AdSlot) => {
		communicationService.dispatch(
			hideMessageBoxEvent({
				adSlotName: adSlot.getSlotName(),
			}),
		);
	};
}
