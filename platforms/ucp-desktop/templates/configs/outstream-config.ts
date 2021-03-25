import { slotsContext } from '@platforms/shared';
import { NavbarManager, PorvataTemplateConfig } from '@wikia/ad-engine';

export const getOutstreamConfig = (): PorvataTemplateConfig => {
	const navbarManager = new NavbarManager(document.getElementById('globalNavigation'));

	return {
		inViewportOffsetTop: navbarManager.getHeight(),
		isFloatingEnabled: true,
		onInit: (adSlot, params) => {
			slotsContext.setupSlotVideoAdUnit(adSlot, params);
			params.viewportHookElement = document.getElementById('INCONTENT_WRAPPER');
		},
	};
};
