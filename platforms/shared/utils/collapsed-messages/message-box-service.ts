import { AdSlot } from '@wikia/ad-engine';
import { MessageBoxCreator } from './message-box-creator';

export type MessageBoxType = 'REGISTER' | 'FANLAB' | 'NEWSLETTER';

export class MessageBoxService {
	private types: MessageBoxType[] = ['REGISTER', 'FANLAB'];
	private currentType = 0;

	getCurrentTypeIndex = (): number => {
		return this.currentType;
	};

	addMessageBox = (placeholder: HTMLElement, adSlot: AdSlot): void => {
		if (this.currentType >= this.types.length) {
			return;
		}

		this.addBoxOfType(this.types[this.currentType], placeholder, adSlot);
		this.currentType += 1;
	};

	addBoxOfType = (type: MessageBoxType, placeholder: HTMLElement, adSlot: AdSlot) => {
		const messageBox = new MessageBoxCreator().createMessageBox(type);
		messageBox.createBox(placeholder, adSlot);
	};

	shouldAddMessageBox = (actionEvent: string, placeholder: HTMLElement): boolean => {
		if (this.isTopLeaderboard(placeholder) || this.isBottomLeaderoard(placeholder)) {
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
}
