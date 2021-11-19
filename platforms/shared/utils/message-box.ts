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
		const message = document.createElement('p');
		message.innerHTML =
			'It looks like your ad has not been loaded... You can remove the gap by clicking the button below. Enjoy your fandom! :)';
		return message;
	};

	private createButton = (placeholder: HTMLElement, adSlot: AdSlot): HTMLButtonElement => {
		const button = document.createElement('button');
		button.className = 'collapse-btn';
		button.innerHTML = 'hide';
		button.onclick = () => {
			this.hidePlaceholder(placeholder);
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

	private sendTrackingEvent = (adSlot: AdSlot) => {
		communicationService.dispatch(
			hideMessageBoxEvent({
				adSlotName: adSlot.getSlotName(),
			}),
		);
	};
}

export const messageBox = new MessageBox();
