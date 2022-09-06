import { Injectable } from '@wikia/dependency-injection';
import { DataWarehouseTracker } from './data-warehouse';
import { AdSlot, communicationService, eventsRepository } from '@wikia/ad-engine';

/**
 * Wrapper for ad size tracking
 */
@Injectable()
export class AdSizeTracker {
	constructor(private dwTracker: DataWarehouseTracker) {}

	init(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_AD_RESIZED,
			({ slot, sizes }) => {
				this.track(slot, Math.floor(sizes.width), Math.floor(sizes.height));
			},
			false,
		);
	}

	/**
	 * Track ad size
	 */
	track(slot: AdSlot, ad_width: number, ad_height: number): void {
		const trackingURL = 'https://beacon.wikia-services.com/__track/special/adengadsizeinfo';

		this.dwTracker.track(
			{
				ad_width: ad_width,
				ad_height: ad_height,
				slot_id: slot.getUid() || '',
				rv: slot.getConfigProperty('targeting.rv') || '',
				position: slot.getMainPositionName(),
			},
			trackingURL,
		);
	}
}
