import { AdSlot, events, eventService, utils } from '@ad-engine/core';
import { merge, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { JWPlayerHelper } from './jwplayer-helper';
import { JWPlayerStreams } from './jwplayer-streams';
import {
	EMPTY_VAST_CODE,
	shouldPlayMidroll,
	shouldPlayPostroll,
	shouldPlayPreroll,
} from './jwplayer-utils';

const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

/**
 * Describes what is done
 */
export class JWPlayerHandler {
	constructor(
		private adSlot: AdSlot,
		private streams: JWPlayerStreams,
		private helper: JWPlayerHelper,
	) {}

	run(): Observable<any> {
		return merge(
			this.adError(),
			this.adRequest(),
			this.adImpression(),
			this.complete(),
			this.adBlock(),
			this.beforePlay(),
			this.videoMidPoint(),
			this.beforeComplete(),
		);
	}

	private adError(): Observable<any> {
		return this.streams.adError$.pipe(
			tap(({ event, vastParams }) => {
				log(`ad error message: ${event.message}`);
				this.helper.setAdSlotParams(vastParams);
				this.helper.setAdSlotElementAttributes(vastParams);

				if (event.adErrorCode === EMPTY_VAST_CODE) {
					this.adSlot.setStatus(AdSlot.STATUS_COLLAPSE);
				} else {
					this.adSlot.setStatus(AdSlot.STATUS_ERROR);
				}

				eventService.emit(events.VIDEO_AD_ERROR, this.adSlot);
			}),
		);
	}

	private adRequest(): Observable<any> {
		return this.streams.adRequest$.pipe(
			tap(({ vastParams }) => {
				this.helper.setAdSlotElementAttributes(vastParams);
				eventService.emit(events.VIDEO_AD_REQUESTED, this.adSlot);
			}),
		);
	}

	private adImpression(): Observable<any> {
		return this.streams.adImpression$.pipe(
			tap(({ vastParams }) => {
				this.helper.setAdSlotParams(vastParams);
				this.adSlot.setStatus(AdSlot.STATUS_SUCCESS);
				eventService.emit(events.VIDEO_AD_IMPRESSION, this.adSlot);
			}),
			filter(() => this.helper.isMoatTrackingEnabled()),
			tap(({ event }) => this.helper.trackMoat(event)),
		);
	}

	private complete(): Observable<any> {
		return this.streams.complete$.pipe(tap(() => this.helper.resetTrackerAdProduct()));
	}

	private adBlock(): Observable<any> {
		return this.streams.adBlock$.pipe(tap(() => this.helper.resetTrackerAdProduct()));
	}

	private beforePlay(): Observable<any> {
		return this.streams.beforePlay$.pipe(
			tap(({ depth }) => {
				this.helper.updateVideoId();
				this.adSlot.setConfigProperty('videoDepth', depth);
			}),
			filter(({ depth }) => shouldPlayPreroll(depth)),
			tap(({ depth, correlator }) => this.helper.playVideoAd('preroll', depth, correlator)),
		);
	}

	private videoMidPoint(): Observable<any> {
		return this.streams.videoMidPoint$.pipe(
			filter(({ depth }) => shouldPlayMidroll(depth)),
			tap(({ depth, correlator }) => this.helper.playVideoAd('midroll', depth, correlator)),
		);
	}

	private beforeComplete(): Observable<any> {
		return this.streams.beforeComplete$.pipe(
			filter(({ depth }) => shouldPlayPostroll(depth)),
			tap(({ depth, correlator }) => this.helper.playVideoAd('postroll', depth, correlator)),
		);
	}
}
