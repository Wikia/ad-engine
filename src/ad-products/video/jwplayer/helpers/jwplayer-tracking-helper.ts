import { AdSlot, VideoData, VideoEventData } from '@ad-engine/core';
import * as Cookies from 'js-cookie';
import playerEventEmitter from '../../../tracking/video/player-event-emitter';
import videoEventDataProvider from '../../../tracking/video/video-event-data-provider';
import { JwpEventKey } from '../streams/jwplayer-events';
import { JwpEvent } from '../streams/jwplayer-stream';

const trackingEventsMap = {
	init: 'init',
	lateReady: 'late_ready',
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
	error: 'content_error',
};

type TrackingEvent = keyof typeof trackingEventsMap;

export class JWPlayerTrackingHelper {
	constructor(private readonly adSlot: AdSlot) {}

	track<T extends TrackingEvent>(event: JwpEvent<T>): void {
		const videoData = this.getVideoData(event);
		const eventInfo: VideoEventData = videoEventDataProvider.getEventData(videoData);

		playerEventEmitter.emit(eventInfo);
	}

	isTrackingEvent(event: JwpEvent<JwpEventKey>): event is JwpEvent<TrackingEvent> {
		return Object.keys(trackingEventsMap).includes(event.name);
	}

	private getVideoData(event: JwpEvent<TrackingEvent>): VideoData {
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
			position: this.adSlot.config.slotName,
			user_block_autoplay: this.getUserBlockAutoplay(),
			video_id: event.state.playlistItem.mediaid || '',
		};
	}

	private getErrorCode(event: JwpEvent<'adError'>): number {
		if (!['adError', 'error'].includes(event.name)) {
			return 0;
		}

		return event.payload && event.payload.code;
	}

	private getAdProduct<T extends JwpEventKey>(event: JwpEvent<T>): string {
		switch (event.state.adInVideo) {
			case 'none':
				return this.adSlot.config.slotName;
			case 'midroll':
			case 'postroll':
			case 'preroll':
				return `${this.adSlot.config.trackingKey}-${event.state.adInVideo}`;
			case 'bootstrap':
			default:
				return this.adSlot.config.trackingKey;
		}
	}

	private getCtp<T extends JwpEventKey>(event: JwpEvent<T>): 0 | 1 {
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
