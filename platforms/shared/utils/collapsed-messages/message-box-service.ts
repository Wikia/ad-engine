import { AdSlot } from '@wikia/ad-engine';
import { MessageBoxCreator } from './message-box-creator';

export type MessageBoxType = 'REGISTER' | 'NEWSLETTER' | 'FANLAB';

export class MessageBoxService {
	addMessageBox = (placeholder: HTMLElement, adSlot: AdSlot): void => {
		if (!this.isRegisterBoxAdded()) {
			this.addRegisterBox(placeholder, adSlot);
			return;
		}

		if (!this.isNewsletterBoxAdded()) {
			this.addNewsletterBox();
			return;
		}

		if (!this.isFanLabAdded()) {
			this.addFanLabelBox();
		}
	};

	isRegisterBoxAdded = (): boolean => {
		return document.querySelector('.cm-register') !== null;
	};

	isNewsletterBoxAdded = (): boolean => {
		return true;
	};

	isFanLabAdded = (): boolean => {
		return true;
	};

	addRegisterBox = (placeholder: HTMLElement, adSlot: AdSlot): void => {
		const registerMessageBox = new MessageBoxCreator().createMessageBox('REGISTER');

		const boxElement = registerMessageBox.createBoxWrapper();
		const message = registerMessageBox.createMessage();
		const button = registerMessageBox.createButton();
		button.onclick = () => {
			registerMessageBox.openInNewTab();
			registerMessageBox.sendTrackingEvent(adSlot);
		};

		boxElement.append(message, button);
		placeholder.appendChild(boxElement);
	};

	addNewsletterBox = (): void => {};

	addFanLabelBox = (): void => {};

	shouldAddMessageBox = (actionEvent: string, placeholder: HTMLElement): boolean => {
		if (this.isItTlbOrBlb(placeholder)) {
			return false;
		}
		if (this.numOfMessageBoxesOnPage() > 3) {
			return false;
		}

		return actionEvent === AdSlot.STATUS_COLLAPSE;
	};

	numOfMessageBoxesOnPage = (): number => {
		return document.querySelectorAll('.message-box').length;
	};

	isItTlbOrBlb = (placeholder: HTMLElement): boolean => {
		return (
			placeholder.classList.contains('top-leaderboard') ||
			placeholder.classList.contains('bottom-leaderboard')
		);
	};
}
