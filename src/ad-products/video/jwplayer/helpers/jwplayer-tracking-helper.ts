import { AdSlot, VideoData, VideoEventData } from '@ad-engine/core';
import * as Cookies from 'js-cookie';
import playerEventEmitter from '../../../tracking/video/player-event-emitter';
import videoEventDataProvider from '../../../tracking/video/video-event-data-provider';
import { JWPlayerEventKey } from '../external-types/jwplayer';
import { JwpEvent } from '../streams/jwplayer-streams';

export class JwplayerTrackingHelper {
	constructor(private readonly slot: AdSlot) {}

	track<T extends JWPlayerEventKey>(event: JwpEvent<T>): void {
		const videoData = this.getVideoData(event);
		const eventInfo: VideoEventData = videoEventDataProvider.getEventData(videoData);

		playerEventEmitter.emit(eventInfo);
	}

	private getVideoData<T extends JWPlayerEventKey>(event: JwpEvent<T>): VideoData {
		return {
			ad_error_code: this.getErrorCode(event as any),
			ad_product: undefined, // TODO
			audio: !event.state.mute ? 1 : 0,
			ctp: undefined, // TODO
			content_type: event.state.vastParams.contentType,
			creative_id: event.state.vastParams.creativeId,
			line_item_id: event.state.vastParams.lineItemId,
			event_name: event.name,
			player: 'jwplayer',
			position: this.slot.config.slotName,
			user_block_autoplay: this.getUserBlockAutoplay(),
			video_id: event.state.playlistItem.mediaid || '',
		};
	}

	private getErrorCode(event: JwpEvent<'adError'>): number | undefined {
		if (event.name !== 'adError') {
			return;
		}

		return event.payload && event.payload.code;
	}

	private getUserBlockAutoplay(): 1 | 0 | -1 {
		const featuredVideoAutoplayCookie = Cookies.get('featuredVideoAutoplay') || '-1';

		switch (featuredVideoAutoplayCookie) {
			case '1':
				return 1;
			case '0':
				return 0;
			case '-1':
			default:
				return -1;
		}
	}
}
