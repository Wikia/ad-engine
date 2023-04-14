import { AdSlot, AdSlotStatus, sailthru } from '@wikia/ad-engine';
import { MessageBoxCreator } from './message-box-creator';
import type { MessageBoxType } from './message-box-type';

export class MessageBoxService {
	private messageBoxCreator: MessageBoxCreator;
	private types: MessageBoxType[];
	private currentType = 0;
	private isEnabled: boolean;

	constructor(isEnabledConfigurationFlag: boolean) {
		this.messageBoxCreator = new MessageBoxCreator();
		this.types = sailthru.isEnabled()
			? ['REGISTER', 'FANLAB', 'NEWSLETTER_FORM', 'NEWSLETTER_LINK']
			: ['REGISTER', 'FANLAB', 'NEWSLETTER_LINK'];
		this.isEnabled = isEnabledConfigurationFlag;
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
		if (!this.isEnabled) {
			return false;
		}

		if (
			this.isTopLeaderboard(placeholder) ||
			this.isBottomLeaderoard(placeholder) ||
			this.hasAlreadyMessageBox(placeholder)
		) {
			return false;
		}

		return actionEvent === AdSlotStatus.STATUS_COLLAPSE;
	}

	isTopLeaderboard(placeholder: HTMLElement): boolean {
		return placeholder.classList.contains('top-leaderboard');
	}

	isBottomLeaderoard(placeholder: HTMLElement): boolean {
		return placeholder.classList.contains('bottom-leaderboard');
	}

	hasAlreadyMessageBox(placeholder: HTMLElement): boolean {
		return placeholder.classList.contains('has-message-box');
	}
}
