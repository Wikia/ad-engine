import { context, slotService, utils } from '@wikia/ad-engine';

export default {
	/**
	 * Prepares data object for video events tracking
	 * @param {object} videoData
	 * @param {string} videoData.ad_product
	 * @param {string} videoData.event_name
	 * @param {string} videoData.player
	 * @param {string} videoData.position
	 * @param {string} [videoData.ad_error_code]
	 * @param {string} [videoData.audio]
	 * @param {string} [videoData.content_type]
	 * @param {string} [videoData.creative_id]
	 * @param {string} [videoData.ctp]
	 * @param {string} [videoData.line_item_id]
	 * @param {string} [videoData.user_block_autoplay]
	 * @param {string} [videoData.video_id]
	 * @returns {object}
	 */
	getEventData(videoData) {
		const now = new Date();
		const slot = slotService.get(videoData.position);

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
			document_visibility: utils.getDocumentVisibilityStatus(),
			event_name: videoData.event_name,
			line_item_id: videoData.line_item_id || '',
			player: videoData.player,
			position: slot.getSlotName().toLowerCase(),
			pv_number: context.get('options.pvNumber') || window.pvNumber || -1,
			price: '',
			skin: context.get('targeting.skin') || {},
			timestamp: now.getTime(),
			tz_offset: now.getTimezoneOffset(),
			user_block_autoplay: videoData.user_block_autoplay || '',
			video_id: videoData.video_id || '',
			wsi: slot.targeting.wsi || '',
		};
	},
};
