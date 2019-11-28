import { AdSlot, context, slotService, VastParams } from '@ad-engine/core';
import { JWPlayerTracker } from '../tracking/video/jwplayer-tracker';

export interface VideoTargeting {
	plist?: string;
	videoTags?: string | string[]; // not sure about `string`
	v1?: string;
}

interface HdPlayerEvent extends CustomEvent {
	detail: {
		slotStatus?: {
			vastParams: any;
			statusName: string;
		};
		name?: string | null;
		errorCode: number;
	};
}

export interface JwPlayerAdsFactoryOptions {
	adProduct: string;
	slotName: string;
	audio: boolean;
	autoplay: boolean;
	featured: boolean;
	videoId: string;
}

function updateSlotParams(adSlot: AdSlot, vastParams: VastParams): void {
	adSlot.lineItemId = vastParams.lineItemId;
	adSlot.creativeId = vastParams.creativeId;
	adSlot.creativeSize = vastParams.size;
}

/**
 * Creates instance with ads schedule and tracking for JWPlayer
 */
function create(
	options: JwPlayerAdsFactoryOptions,
): { register: (player, slotTargeting?: VideoTargeting) => void } {
	function register(player): void {
		const adSlot = slotService.get(slotName);

		if (context.get('options.wad.hmdRec.enabled')) {
			document.addEventListener('hdPlayerEvent', (event: HdPlayerEvent) => {
				if (event.detail.slotStatus) {
					updateSlotParams(adSlot, event.detail.slotStatus.vastParams);
					tracker.updateCreativeData(event.detail.slotStatus.vastParams);
					adSlot.setStatus(event.detail.slotStatus.statusName);
				}

				if (event.detail.name) {
					tracker.emit(event.detail.name, event.detail.errorCode);
				}
			});
		}

		tracker.register(player);
	}

	const slotName = options.slotName || (options.featured ? 'featured' : 'video');
	const slot = slotService.get(slotName) || new AdSlot({ id: slotName });

	if (!slotService.get(slotName)) {
		slotService.add(slot);
	}

	const tracker = new JWPlayerTracker({
		slotName,
		adProduct: slot.config.trackingKey,
		audio: options.audio,
		ctp: !options.autoplay,
		videoId: options.videoId,
	});

	return {
		register,
	};
}

export const jwplayerAdsFactory = {
	create,
};
