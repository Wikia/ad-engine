import { AdSlot, VideoData, VideoEventData } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import * as Cookies from 'js-cookie';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import playerEventEmitter from '../../../tracking/video/player-event-emitter';
import videoEventDataProvider from '../../../tracking/video/video-event-data-provider';
import { PlayerReadyResult } from '../helpers/player-ready-result';
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

@Injectable({ scope: 'Transient' })
export class JWPlayerTrackingHandler {
	private adSlot: AdSlot;
	private lastKnownAdData = {
		contentType: '',
		creativeId: '',
		lineItemId: '',
	};

	handle({ adSlot, stream$ }: PlayerReadyResult): Observable<unknown> {
		this.adSlot = adSlot;

		return stream$.pipe(
			filter((event) => this.isTrackingEvent(event)),
			tap((event: JwpEvent<TrackingEvent>) => this.track(event)),
		);
	}

	private track(event: JwpEvent<TrackingEvent>): void {
		const videoData = this.getVideoData(event);
		const eventInfo: VideoEventData = videoEventDataProvider.getEventData(videoData);

		playerEventEmitter.emit(eventInfo);
	}

	private isTrackingEvent(event: JwpEvent<JwpEventKey>): event is JwpEvent<TrackingEvent> {
		return Object.keys(trackingEventsMap).includes(event.name);
	}

	private getVideoData(event: JwpEvent<TrackingEvent>): VideoData {
		this.lastKnownAdData.contentType =
			event.state.vastParams.contentType || this.lastKnownAdData.contentType;
		this.lastKnownAdData.creativeId =
			event.state.vastParams.creativeId || this.lastKnownAdData.creativeId;
		this.lastKnownAdData.lineItemId =
			event.state.vastParams.lineItemId || this.lastKnownAdData.lineItemId;

		return {
			ad_error_code: this.getErrorCode(event as any),
			ad_product: this.getAdProduct(event),
			audio: !event.state.mute ? 1 : 0,
			ctp: this.getCtp(event),
			content_type: this.lastKnownAdData.contentType,
			creative_id: this.lastKnownAdData.creativeId,
			line_item_id: this.lastKnownAdData.lineItemId,
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
