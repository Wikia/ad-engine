import { AdSlotEvent, AdSlotStatus, HIDDEN_AD_CLASS } from '@wikia/ad-engine';

export class PlaceholderServiceHelper {
	statusesToStopLoadingSlot: string[] = [
		AdSlotEvent.SLOT_RENDERED_EVENT,
		AdSlotStatus.STATUS_SUCCESS,
		AdSlotEvent.HIDDEN_EVENT,
	];
	statusesToCollapse: string[] = [
		AdSlotEvent.HIDDEN_EVENT,
		AdSlotStatus.STATUS_BLOCKED,
		AdSlotStatus.STATUS_COLLAPSE,
	];
	statusToHide: string = AdSlotStatus.STATUS_FORCED_COLLAPSE;
	statusToUndoCollapse: string = AdSlotEvent.SLOT_RENDERED_EVENT;

	isLoadingOrCollapsed = (action: object): boolean => {
		return (
			this.statusesToStopLoadingSlot.includes(action['event']) ||
			this.statusesToCollapse.includes(action['event']) ||
			this.statusToUndoCollapse === action['event']
		);
	};

	displayPlaceholder = (placeholder: HTMLElement): void => {
		placeholder.classList.remove(HIDDEN_AD_CLASS);
	};

	shouldKeepPlaceholder = (eventName: string, slotStatus: string): boolean => {
		return (
			eventName === this.statusToUndoCollapse && slotStatus === AdSlotStatus.STATUS_FORCED_SUCCESS
		);
	};

	stopLoading = (actionEvent: string, placeholder: HTMLElement): void => {
		if (this.shouldStopLoading(actionEvent, placeholder)) {
			placeholder.classList.remove('is-loading');
		}
	};

	shouldStopLoading = (actionEvent: string, placeholder: HTMLElement): boolean => {
		return (
			this.statusesToStopLoadingSlot.includes(actionEvent) &&
			placeholder.classList.contains('is-loading')
		);
	};

	hidePlaceholder = (placeholder: HTMLElement): void => {
		if (this.shouldHidePlaceholder) {
			placeholder.classList.add(HIDDEN_AD_CLASS);

			this.hideWrapperIfExists(placeholder);
		}
	};

	hideWrapperIfExists = (placeholder: HTMLElement): void => {
		if (placeholder?.parentElement?.className.includes('-ads-container')) {
			placeholder.parentElement.classList.add(HIDDEN_AD_CLASS);
		}
	};

	shouldHidePlaceholder = (placeholder: HTMLElement): boolean => {
		return !placeholder.classList.contains(HIDDEN_AD_CLASS);
	};

	hiddenAdLabel = (adLabel: HTMLElement): void => {
		if (this.shouldHiddenAdLabel) {
			adLabel.classList.add(HIDDEN_AD_CLASS);
		}
	};

	shouldHiddenAdLabel = (adLabel: HTMLElement): boolean => {
		return !adLabel.classList.contains(HIDDEN_AD_CLASS);
	};
}
