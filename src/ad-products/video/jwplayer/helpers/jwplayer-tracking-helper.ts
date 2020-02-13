import { AdSlot, Dictionary, VideoData, VideoEventData } from '@ad-engine/core';
import * as Cookies from 'js-cookie';
import playerEventEmitter from '../../../tracking/video/player-event-emitter';
import videoEventDataProvider from '../../../tracking/video/video-event-data-provider';
import { JWPlayerEventKey } from '../external-types/jwplayer';
import { JwpEvent } from '../streams/jwplayer-streams';

const trackingEventsMap: Dictionary<string> = {
	ready: 'ready',
	adBlock: 'blocked',
	adClick: 'clicked',
	adRequest: 'loaded',
	adError: 'error',
	adImpression: 'impression',
	adStarted: 'started',
	adViewableImpression: 'viewable_impression',
	adFirstQuartile: 'first_quartile',
	adMidPoint: 'midpoint',
	adThirdQuartile: 'third_quartile',
	adComplete: 'completed',
	adSkipped: 'skipped',
	videoStart: 'content_started',
	complete: 'content_completed',
};

export class JwplayerTrackingHelper {
	// TODO: init and late_ready
	constructor(private readonly slot: AdSlot) {}

	track<T extends JWPlayerEventKey>(event: JwpEvent<T>): void {
		if (!this.isTrackableEvent(event)) {
			return;
		}

		const videoData = this.getVideoData(event);
		const eventInfo: VideoEventData = videoEventDataProvider.getEventData(videoData);

		playerEventEmitter.emit(eventInfo);
	}

	private isTrackableEvent<T extends JWPlayerEventKey>(event: JwpEvent<T>): boolean {
		return Object.keys(trackingEventsMap).includes(event.name);
	}

	private getVideoData<T extends JWPlayerEventKey>(event: JwpEvent<T>): VideoData {
		return {
			ad_error_code: this.getErrorCode(event as any),
			ad_product: this.getAdProduct(event),
			audio: !event.state.mute ? 1 : 0,
			ctp: this.getCtp(event),
			content_type: event.state.vastParams.contentType,
			creative_id: event.state.vastParams.creativeId,
			line_item_id: event.state.vastParams.lineItemId,
			event_name: trackingEventsMap[event.name],
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

	private getAdProduct<T extends JWPlayerEventKey>(event: JwpEvent<T>): string {
		switch (event.state.adStatus) {
			case 'complete':
				return this.slot.config.slotName;
			case 'midroll':
			case 'postroll':
			case 'preroll':
				return `${this.slot.config.trackingKey}-${event.state.adStatus}`;
			case 'bootstrap':
			default:
				return this.slot.config.trackingKey;
		}
	}

	private getCtp<T extends JWPlayerEventKey>(event: JwpEvent<T>): 0 | 1 {
		if (event.state.depth > 1) {
			return 0;
		}

		return !event.state.config.autostart ? 1 : 0;
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
