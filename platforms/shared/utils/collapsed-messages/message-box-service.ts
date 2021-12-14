import { AdSlot } from '@wikia/ad-engine';
import { MessageBoxCreator } from './message-box-creator';

export type MessageBoxType = 'REGISTER' | 'NEWSLETTER' | 'FANLAB';

export class MessageBoxService {
	addMessageBox = (placeholder: HTMLElement, adSlot: AdSlot): void => {
		if (this.shouldAddBoxOfType('REGISTER')) {
			this.addBoxOfType('REGISTER', placeholder, adSlot);
			return;
		}

		if (this.shouldAddBoxOfType('FANLAB')) {
			this.addBoxOfType('FANLAB', placeholder, adSlot);
			return;
		}

		if (this.shouldAddBoxOfType('NEWSLETTER')) {
			this.addBoxOfType('NEWSLETTER', placeholder, adSlot);
			return;
		}
	};

	shouldAddBoxOfType = (type: MessageBoxType): boolean => {
		return !document.querySelector(`.cm-${type.toLowerCase()}-box`);
	};

	addBoxOfType = (type: MessageBoxType, placeholder: HTMLElement, adSlot: AdSlot) => {
		const messageBox = new MessageBoxCreator().createMessageBox(type);
		messageBox.createBox(placeholder, adSlot);
	};

	shouldAddMessageBox = (actionEvent: string, placeholder: HTMLElement): boolean => {
		if (
			this.isTopLeaderboard(placeholder) ||
			this.isBottomLeaderoard(placeholder) ||
			this.numOfMessageBoxesOnPage() > 3
		) {
			return false;
		}

		return actionEvent === AdSlot.STATUS_COLLAPSE;
	};

	isTopLeaderboard = (placeholder: HTMLElement): boolean => {
		return placeholder.classList.contains('top-leaderboard');
	};

	isBottomLeaderoard = (placeholder: HTMLElement): boolean => {
		return placeholder.classList.contains('bottom-leaderboard');
	};

	numOfMessageBoxesOnPage = (): number => {
		return document.querySelectorAll('.message-box').length;
	};
}
