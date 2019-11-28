import { AdSlot, events, eventService, utils } from '@ad-engine/core';
import { EMPTY, merge, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { JWPlayerHelper } from './jwplayer-helper';
import { JWPlayerStreams } from './jwplayer-streams';

const EMPTY_VAST_CODE = 21009;
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

	handle(): Observable<any> {
		return merge(
			this.adRequest(),
			this.adError(),
			this.adImpression(),
			this.adBlock(),
			this.adsManager(),
			this.beforePlay(),
			this.videoMidPoint(),
			this.beforeComplete(),
			this.complete(),
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

	private adBlock(): Observable<any> {
		return this.streams.adBlock$.pipe(tap(() => this.helper.resetTrackerAdProduct()));
	}

	private adsManager(): Observable<any> {
		if (!this.helper.isIasTrackingEnabled()) {
			return EMPTY;
		}

		this.helper.loadIasTracker();

		return this.streams.adsManager$.pipe(tap((event) => this.helper.initIasVideoTracking(event)));
	}

	private complete(): Observable<any> {
		return this.streams.complete$.pipe(tap(() => this.helper.resetTrackerAdProduct()));
	}

	private beforePlay(): Observable<any> {
		return this.streams.beforePlay$.pipe(
			tap(({ depth }) => {
				this.helper.updateVideoId();
				this.adSlot.setConfigProperty('videoDepth', depth);
			}),
			filter(({ depth }) => this.helper.shouldPlayPreroll(depth)),
			tap(({ depth, correlator }) => this.helper.playVideoAd('preroll', depth, correlator)),
		);
	}

	private videoMidPoint(): Observable<any> {
		return this.streams.videoMidPoint$.pipe(
			filter(({ depth }) => this.helper.shouldPlayMidroll(depth)),
			tap(({ depth, correlator }) => this.helper.playVideoAd('midroll', depth, correlator)),
		);
	}

	private beforeComplete(): Observable<any> {
		return this.streams.beforeComplete$.pipe(
			filter(({ depth }) => this.helper.shouldPlayPostroll(depth)),
			tap(({ depth, correlator }) => this.helper.playVideoAd('postroll', depth, correlator)),
		);
	}
}
