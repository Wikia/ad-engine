import { AdSlot, communicationService, hideMessageBoxEvent } from '@wikia/ad-engine';

class MessageBox {
	addMessageBox = (placeholder: HTMLElement, adSlot: AdSlot): void => {
		const box = document.createElement('div');
		box.className = 'message-box';

		const button = this.createButton(placeholder, adSlot);

		const message = this.createMessage();

		box.append(message, button);
		placeholder.appendChild(box);
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
			this.hidePlaceholder(placeholder);
			this.openInNewTab(url);
			this.sendTrackingEvent(adSlot);
		};
		return button;
	};

	private hidePlaceholder = (placeholder: HTMLElement) => {
		if (placeholder.className.includes('top-leaderboard')) {
			placeholder.parentElement.classList.add('hide');
		} else {
			placeholder.classList.add('hide');
		}
	};

	private openInNewTab = (url: string): void => {
		window.open(url, '_blank').focus();
	};

	private sendTrackingEvent = (adSlot: AdSlot) => {
		communicationService.dispatch(
			hideMessageBoxEvent({
				adSlotName: adSlot.getSlotName(),
			}),
		);
	};
}

export const messageBox = new MessageBox();
