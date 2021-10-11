import { AdSlot, slotService } from '@wikia/ad-engine';
import { removeAdLabel } from './ad-label-helper';

const statusesToStopLoadingSlot: string[] = [
	AdSlot.SLOT_RENDERED_EVENT,
	AdSlot.STATUS_BLOCKED,
	AdSlot.STATUS_COLLAPSE,
	AdSlot.STATUS_FORCED_COLLAPSE,
];

export const stopLoading = (className: string, withHide: string = ''): void => {
	const placeholder: HTMLElement = document.querySelector(className);

	placeholder?.classList.remove('is-loading');

	if (withHide === 'placeholder') {
		placeholder?.setAttribute('style', 'display: none');
	} else if (withHide === 'parent') {
		placeholder?.parentElement?.setAttribute('style', 'display: none');
	}
};

export const stopLoadingSlot = (slotName: string) => {
	const className = `.${slotName.replace('_', '-')}`;

	statusesToStopLoadingSlot.map((status) => {
		slotService.on(slotName, status, () => {
			stopLoading(className);
			if (status !== 'slotRendered') {
				removeAdLabel(slotName);
			}
		});
	});
};
