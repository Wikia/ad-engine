import { PorvataTemplateConfig } from '@wikia/ad-engine';
import { slotsContext } from '../slots';

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
