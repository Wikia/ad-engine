import {
	AdSlot,
	communicationService,
	displayMessageBoxEvent,
	hideMessageBoxEvent,
} from '@wikia/ad-engine';

export class MessageBox {
	addMessageBox = (placeholder: HTMLElement, adSlot: AdSlot): void => {
		const box = document.createElement('div');
		box.className = 'message-box';

		const button = this.createButton(placeholder, adSlot);

		const message = this.createMessage();

		box.append(message, button);
		placeholder.appendChild(box);

		this.sendImpressionEvent(adSlot);
	};

	private createMessage = (): HTMLElement => {
		const message = document.createElement('h3');
		message.className = 'cta-message';
		message.innerHTML = 'Join a passionate community of people who love what you love.';
		return message;
	};

	private createButton = (placeholder: HTMLElement, adSlot: AdSlot): HTMLButtonElement => {
		const url = 'https://www.fandom.com/register';

		const button = document.createElement('button');
		button.className = 'register-btn';
		button.classList.add('wds-button');
		button.innerHTML = 'Register';
		button.onclick = () => {
			this.openInNewTab(url);
			this.sendClickTrackingEvent(adSlot);
		};
		return button;
	};

	private openInNewTab = (url: string): void => {
		window.open(url, '_blank').focus();
	};

	private sendClickTrackingEvent = (adSlot: AdSlot) => {
		communicationService.dispatch(
			hideMessageBoxEvent({
				adSlotName: adSlot.getSlotName(),
				ad_status: 'clicked_collapse',
			}),
		);
	};

	private sendImpressionEvent = (adSlot: AdSlot) => {
		communicationService.dispatch(
			displayMessageBoxEvent({
				adSlotName: adSlot.getSlotName(),
				ad_status: 'collapse_message',
			}),
		);
	};
}
