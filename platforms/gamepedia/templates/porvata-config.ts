import { context, PorvataTemplateConfig } from '@wikia/ad-engine';
import { slotsContext } from '../slots';

export function getPorvataConfig(): PorvataTemplateConfig {
	return {
		isFloatingEnabled: !context.get('state.isMobile'),
		inViewportOffsetTop: 0,
		inViewportOffsetBottom: 0,
		onInit: (adSlot, params) => {
			slotsContext.setupSlotVideoAdUnit(adSlot, params);
		},
	};
}
