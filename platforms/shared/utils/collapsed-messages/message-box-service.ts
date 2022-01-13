import { AdSlot, sailthru } from '@wikia/ad-engine';
import { MessageBoxCreator } from './message-box-creator';

export type MessageBoxType = 'REGISTER' | 'FANLAB' | 'NEWSLETTER_LINK' | 'NEWSLETTER_FORM';

export class MessageBoxService {
	private messageBoxCreator: MessageBoxCreator;
	private types: MessageBoxType[];
	private currentType = 0;

	constructor() {
		this.messageBoxCreator = new MessageBoxCreator();
		this.init();
	}

	init(): void {
		this.types = sailthru.isEnabled()
			? ['REGISTER', 'FANLAB', 'NEWSLETTER_FORM', 'NEWSLETTER_LINK']
			: ['REGISTER', 'FANLAB', 'NEWSLETTER_LINK'];
	}

	getCurrentTypeIndex(): number {
		return this.currentType;
	}

	addMessageBox(adSlot: AdSlot): void {
		if (this.currentType >= this.types.length) {
			return;
		}

		const messageBox = this.messageBoxCreator.createMessageBox(
			this.types[this.currentType],
			adSlot,
		);

		messageBox.create();

		this.currentType += 1;
	}

	shouldAddMessageBox(actionEvent: string, placeholder: HTMLElement): boolean {
		if (this.isTopLeaderboard(placeholder) || this.isBottomLeaderoard(placeholder)) {
			return false;
		}

		return actionEvent === AdSlot.STATUS_COLLAPSE;
	}

	isTopLeaderboard(placeholder: HTMLElement): boolean {
		return placeholder.classList.contains('top-leaderboard');
	}

	isBottomLeaderoard(placeholder: HTMLElement): boolean {
		return placeholder.classList.contains('bottom-leaderboard');
	}
}
