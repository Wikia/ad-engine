import { communicationService, eventsRepository } from '@ad-engine/communication';
import { globalContextService, utils } from '../index';
import { VideoData, VideoEventData } from '../listeners';
import { targetingService } from '../services';

export class VideoEventProvider {
	static getEventData(videoData: VideoData): VideoEventData {
		const now: Date = new Date();

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
			position: videoData.position || '',
			pv_number: globalContextService.getValue('tracking', 'pvNumber'),
			rv: targetingService.get('rv', videoData.position) || '',
			skin: targetingService.get('skin') || '',
			timestamp: now.getTime(),
			tz_offset: now.getTimezoneOffset(),
			user_block_autoplay: videoData.user_block_autoplay,
			video_id: videoData.video_id || '',
			video_number: videoData.video_number || '',
		};
	}

	static emit(eventInfo: VideoEventData): void {
		if (!eventInfo.ad_product || !eventInfo.player || !eventInfo.event_name) {
			return;
		}

		communicationService.emit(eventsRepository.VIDEO_PLAYER_TRACKING, { eventInfo });
	}

	static emitVideoEvent(videoEvent): void {
		communicationService.emit(eventsRepository.VIDEO_EVENT, { videoEvent });
	}
}
