import { AdSlot } from '@wikia/ad-engine';

export class PlaceholderServiceHelper {
	statusesToStopLoadingSlot: string[] = [AdSlot.STATUS_SUCCESS, AdSlot.HIDDEN_EVENT];
	statusesToCollapse: string[] = [
		AdSlot.HIDDEN_EVENT,
		AdSlot.STATUS_BLOCKED,
		AdSlot.STATUS_COLLAPSE,
	];
	statusToHide: string = AdSlot.STATUS_FORCED_COLLAPSE;
	statusToUndoCollapse: string = AdSlot.SLOT_RENDERED_EVENT;

	isLoadingOrCollapsed = (action: object): boolean => {
		return (
			this.statusesToStopLoadingSlot.includes(action['event']) ||
			this.statusesToCollapse.includes(action['event']) ||
			this.statusToUndoCollapse === action['event']
		);
	};

	displayPlaceholder = (placeholder: HTMLElement): void => {
		placeholder.classList.remove('hide');
	};

	shouldDisplayPlaceholder = (actionEvent: string, actionPayload: string): boolean => {
		return actionEvent === this.statusToUndoCollapse && actionPayload === 'forced_success';
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
			placeholder.classList.add('hide');
		}
	};

	shouldHidePlaceholder = (placeholder: HTMLElement): boolean => {
		return !placeholder.classList.contains('hide');
	};

	hideAdLabel = (adLabel: HTMLElement): void => {
		if (this.shouldHideAdLabel) {
			adLabel.classList.add('hide');
		}
	};

	shouldHideAdLabel = (adLabel: HTMLElement): boolean => {
		return !adLabel.classList.contains('hide');
	};
}
