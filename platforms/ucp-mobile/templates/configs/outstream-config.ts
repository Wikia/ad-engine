import { slotsContext } from '@platforms/shared';
import { NavbarManager, PorvataTemplateConfig } from '@wikia/ad-engine';

export const getOutstreamConfig = (): PorvataTemplateConfig => {
	const navbarManager = new NavbarManager(document.querySelector('wds-global-navigation'));

	return {
		inViewportOffsetTop: navbarManager.getHeight(),
		isFloatingEnabled: false,
		onInit: (adSlot, params) => {
			slotsContext.setupSlotVideoAdUnit(adSlot, params);
		},
	};
};
