import { slotsContext } from '@platforms/shared';
import { PorvataTemplateConfig } from '@wikia/ad-engine';

export const getOutstreamConfig = (): PorvataTemplateConfig => {
	return {
		inViewportOffsetTop: document.querySelector('.fandom-sticky-header')?.clientHeight ?? 0,
		isFloatingEnabled: true,
		onInit: (adSlot, params) => {
			slotsContext.setupSlotVideoAdUnit(adSlot, params);
			params.viewportHookElement = document.getElementById('INCONTENT_WRAPPER');
		},
	};
};
