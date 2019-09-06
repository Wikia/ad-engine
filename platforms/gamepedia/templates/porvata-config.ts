import { slotsContext } from '@platforms/shared';
import { PorvataTemplateConfig } from '@wikia/ad-engine';

export function getPorvataConfig(): PorvataTemplateConfig {
	return {
		isFloatingEnabled: false,
		inViewportOffsetTop: 0,
		inViewportOffsetBottom: 0,
		onInit: (adSlot, params) => {
			slotsContext.setupSlotVideoAdUnit(adSlot, params);
		},
	};
}
