import { slotsContext } from '@platforms/shared';
import { NavbarManager, PorvataTemplate, templateService } from '@wikia/ad-engine';

const getPorvataConfig = () => {
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

export function registerPorvataTemplate(): void {
	templateService.register(PorvataTemplate, getPorvataConfig());
}
