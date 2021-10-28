import { AdSlot } from '../models';
import { SlotCreator } from './slot-creator';
import { slotService } from './slot-service';

class PlaceholderService {
	slotCreator = new SlotCreator();

	stopLoading = (slotName: string): void => {
		const slotElement: HTMLElement = document.querySelector(`#${slotName}`);
		const placeholder: HTMLElement = slotElement?.parentElement;
		placeholder?.classList.remove('is-loading');
	};

	hideCollapsedPlaceholders(slotName: string): void {
		const statusesToCollapse: string[] = [
			AdSlot.STATUS_BLOCKED,
			AdSlot.STATUS_COLLAPSE,
			AdSlot.STATUS_FORCED_COLLAPSE,
		];
		statusesToCollapse.map((status) => {
			slotService.on(slotName, status, () => {
				this.hidePlaceholder(slotName);
			});
		});
	}

	hidePlaceholder = (slotName: string): void => {
		const slotElement: HTMLElement = document.querySelector(`#${slotName}`);
		const placeholder: HTMLElement =
			slotName === 'top_leaderboard'
				? document.querySelector('.top-ads-container')
				: slotElement?.parentElement;

		placeholder?.classList.add('hide');
	};
}

export const placeholderService = new PlaceholderService();
