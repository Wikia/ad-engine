import { AdSlot } from '../models';
import { SlotCreator } from './slot-creator';
import { slotService } from './slot-service';

class PlaceholderService {
	slotCreator = new SlotCreator();

	stopLoadingSlot = (slotName: string, slotHasLabel: boolean) => {
		const statusesToCollapse: string[] = [
			AdSlot.STATUS_BLOCKED,
			AdSlot.STATUS_COLLAPSE,
			AdSlot.STATUS_FORCED_COLLAPSE,
		];
		const statusesToStopLoadingSlot: string[] = [...statusesToCollapse, AdSlot.SLOT_RENDERED_EVENT];

		statusesToStopLoadingSlot.map((status) => {
			slotService.on(slotName, status, () => {
				this.stopLoading(slotName);
			});
		});

		statusesToCollapse.map((status) => {
			slotService.on(slotName, status, () => {
				if (slotHasLabel || slotName === 'top_leaderboard') {
					this.slotCreator.hideAdLabel(slotName);
				}
			});
		});
	};

	stopLoading = (slotName: string): void => {
		const slotElement: HTMLElement = document.querySelector(`#${slotName}`);
		const placeholder: HTMLElement = slotElement?.parentElement;
		placeholder?.classList.remove('is-loading');
	};

	hideCollapsedPlaceholdersOnUap(slotName: string): void {
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
