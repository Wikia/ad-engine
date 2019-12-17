import { utils } from '@ad-engine/core';
import { merge, Observable } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { JWPlayerHelper } from './jwplayer-helper';
import { JWPlayerStreams } from './jwplayer-streams';

const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

/**
 * Describes what is done
 */
export class JWPlayerHandler {
	constructor(private streams: JWPlayerStreams, private helper: JWPlayerHelper) {}

	handle(): Observable<any> {
		return merge(
			this.adError(),
			this.adRequest(),
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
				this.helper.setSlotParams(vastParams);
				this.helper.setSlotElementAttributes(vastParams);
				this.helper.emitVideoAdError(event.adErrorCode);
			}),
		);
	}

	private adRequest(): Observable<any> {
		return this.streams.adRequest$.pipe(
			tap(({ vastParams }) => {
				this.helper.setSlotElementAttributes(vastParams);
				this.helper.emitVideoAdRequest();
			}),
		);
	}

	private adImpression(): Observable<any> {
		return this.streams.adImpression$.pipe(
			tap(({ vastParams }) => {
				this.helper.setSlotParams(vastParams);
				this.helper.emitVideoAdImpression();
			}),
			filter(() => this.helper.isMoatTrackingEnabled()),
			tap(({ event }) => this.helper.trackMoat(event)),
		);
	}

	private adBlock(): Observable<any> {
		return this.streams.adBlock$.pipe(tap(() => this.helper.resetTrackerAdProduct()));
	}

	private adsManager(): Observable<any> {
		return this.streams.adsManager$.pipe(
			filter(() => this.helper.isIasTrackingEnabled()),
			tap((event) => this.helper.initIasVideoTracking(event)),
		);
	}

	private beforePlay(): Observable<any> {
		return this.streams.beforePlay$.pipe(
			tap(({ depth }) => {
				this.helper.updateVideoId();
				this.helper.updateVideoDepth(depth);
			}),
			filter(({ depth }) => this.helper.shouldPlayPreroll(depth)),
			mergeMap((payload) => this.helper.awaitIasTracking(payload)),
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

	private complete(): Observable<any> {
		return this.streams.complete$.pipe(tap(() => this.helper.resetTrackerAdProduct()));
	}
}
