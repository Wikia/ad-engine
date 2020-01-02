import { AdSlot, BigFancyAdAboveConfig, UapParams, universalAdPackage } from '@wikia/ad-engine';
import { slotsContext } from '../../shared/slots/slots-context';

const { CSS_TIMING_EASE_IN_CUBIC } = universalAdPackage;

export function getBfaaConfig():
	| BigFancyAdAboveConfig
	| { setBodyPaddingTop: (padding: string) => void } {
	return {
		adSlot: null,
		autoPlayAllowed: true,
		defaultStateAllowed: true,
		fullscreenAllowed: true,
		stickinessAllowed: true,
		// slotsToDisable: ['cdm-zone-06', 'incontent_player'],
		slotsToEnable: ['bottom_leaderboard', 'incontent_boxad_1', 'top_boxad'],
		moveNavbar: (offset, time) => {
			const navbarElement: HTMLElement = document.querySelector('.wds-global-navigation-wrapper');

			if (navbarElement) {
				navbarElement.style.transition = offset ? '' : `top ${time}ms ${CSS_TIMING_EASE_IN_CUBIC}`;
				navbarElement.style.top = offset ? `${offset}px` : '';
			}
		},
		onInit(adSlot: AdSlot, params: UapParams, config: BigFancyAdAboveConfig): void {
			slotsContext.setupSlotVideoAdUnit(adSlot, params);
		},
	};
}
