import { AdSlot, communicationService, eventsRepository } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { trackingUrls } from '../setup/tracking-urls';
import { DataWarehouseTracker } from './data-warehouse';

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
				this.track(slot, sizes.width, sizes.height);
			},
			false,
		);
	}

	/**
	 * Track ad size
	 */
	track(slot: AdSlot, ad_width: number, ad_height: number): void {
		this.dwTracker.track(
			{
				ad_width: ad_width,
				ad_height: ad_height,
				slot_id: slot.getUid() || '',
				creative_id: slot.creativeId || '',
				line_item_id: slot.lineItemId || '',
				rv: slot.getTargetingProperty('rv') || '',
				position: slot.getMainPositionName(),
				slot_size: slot.getCreativeSize() || '',
			},
			trackingUrls.AD_ENG_AD_SIZE_INFO.url,
		);
	}
}
