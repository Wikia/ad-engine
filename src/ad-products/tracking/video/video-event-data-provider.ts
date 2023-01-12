import {
	AdSlot,
	context,
	slotService,
	TargetingData,
	targetingService,
	utils,
	VideoData,
	VideoEventData,
} from '@ad-engine/core';

export class VideoEventDataProvider {
	/**
	 * Prepares data object for video events tracking
	 */
	static getEventData(videoData: VideoData): VideoEventData {
		const now: Date = new Date();
		const slot: AdSlot = slotService.get(videoData.position);

		if (!slot) {
			throw new Error(`Slot ${videoData.position} is not registered.`);
		}

		return {
			ad_error_code: videoData.ad_error_code,
			ad_product: videoData.ad_product,
			audio: videoData.audio ? 1 : 0,
			browser: `${utils.client.getOperatingSystem()} ${utils.client.getBrowser()}`,
			content_type: videoData.content_type || '',
			country: utils.geoService.getCountryCode() || '',
			creative_id: videoData.creative_id || '',
			ctp: videoData.ctp ? 1 : 0,
			event_name: videoData.event_name,
			line_item_id: videoData.line_item_id || '',
			player: videoData.player,
			position: slot.getSlotName().toLowerCase(),
			pv_number: context.get('wiki.pvNumber'),
			rv: slot.getTargetingConfigProperty('rv') || '',
			skin: targetingService.dumpTargeting<TargetingData>().skin || '',
			timestamp: now.getTime(),
			tz_offset: now.getTimezoneOffset(),
			user_block_autoplay: videoData.user_block_autoplay,
			video_id: videoData.video_id || '',
			video_number: videoData.video_number || '',
		};
	}
}
