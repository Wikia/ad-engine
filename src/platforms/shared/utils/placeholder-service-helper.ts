import { AdSlotClass, AdSlotEvent, AdSlotStatus } from '@ad-engine/core';

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
		placeholder.classList.remove(AdSlotClass.HIDDEN_AD_CLASS);
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
			placeholder.classList.add(AdSlotClass.HIDDEN_AD_CLASS);

			this.hideWrapperIfExists(placeholder);
		}
	};

	hideWrapperIfExists = (placeholder: HTMLElement): void => {
		if (placeholder?.parentElement?.className.includes('-ads-container')) {
			placeholder.parentElement.classList.add(AdSlotClass.HIDDEN_AD_CLASS);
		}
	};

	shouldHidePlaceholder = (placeholder: HTMLElement): boolean => {
		return !placeholder.classList.contains(AdSlotClass.HIDDEN_AD_CLASS);
	};

	hideAdLabel = (adLabel: HTMLElement): void => {
		if (this.shouldHideAdLabel) {
			adLabel.classList.add(AdSlotClass.HIDDEN_AD_CLASS);
		}
	};

	shouldHideAdLabel = (adLabel: HTMLElement): boolean => {
		return !adLabel.classList.contains(AdSlotClass.HIDDEN_AD_CLASS);
	};
}
