import { slotsContext } from '@platforms/shared';
import { AdSlot, BigFancyAdBelowConfig, UapParams } from '@wikia/ad-engine';

export function getBfabConfig(): BigFancyAdBelowConfig {
	return {
		autoPlayAllowed: true,
		defaultStateAllowed: true,
		fullscreenAllowed: true,
		stickinessAllowed: false,
		bfaaSlotName: 'cdm-zone-01',

		onInit(adSlot: AdSlot, params: UapParams): void {
			slotsContext.setupSlotVideoAdUnit(adSlot, params);
		},
	};
}
