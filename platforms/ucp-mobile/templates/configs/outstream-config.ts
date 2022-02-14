import { slotsContext } from '@platforms/shared';
import { PorvataTemplateConfig } from '@wikia/ad-engine';

export const getOutstreamConfig = (): PorvataTemplateConfig => {
	return {
		// ADEN-11573: Cleanup after switch
		inViewportOffsetTop:
			document.querySelector('.mobile-global-navigation,.wds-global-navigation')?.clientHeight ?? 0,
		isFloatingEnabled: false,
		onInit: (adSlot, params) => {
			slotsContext.setupSlotVideoAdUnit(adSlot, params);
		},
	};
};
