import { utils } from '@ad-engine/core';
import { merge, Observable } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { JWPlayerHelper } from './helpers/jwplayer-helper';
import { JwpStreams } from './streams/jwplayer-streams';

const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

/**
 * Describes what is done
 */
export class JWPlayerHandler {
	constructor(private streams: JwpStreams, private helper: JWPlayerHelper) {}

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
			tap(({ event, state }) => {
				log(`ad error message: ${event.message}`);
				this.helper.setSlotParams(state.vastParams);
				this.helper.setSlotElementAttributes(state.vastParams);
				this.helper.emitVideoAdError(event.adErrorCode);
			}),
		);
	}

	private adRequest(): Observable<any> {
		return this.streams.adRequest$.pipe(
			tap(({ state }) => {
				this.helper.setSlotElementAttributes(state.vastParams);
				this.helper.emitVideoAdRequest();
			}),
		);
	}

	private adImpression(): Observable<any> {
		return this.streams.adImpression$.pipe(
			tap(({ state }) => {
				this.helper.setSlotParams(state.vastParams);
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
			tap(({ state }) => {
				this.helper.updateVideoDepth(state.depth);
			}),
			filter(({ state }) => this.helper.shouldPlayPreroll(state.depth)),
			mergeMap((payload) => this.helper.awaitIasTracking(payload)),
			tap(({ state }) => this.helper.playVideoAd('preroll', state.depth, state.correlator)),
		);
	}

	private videoMidPoint(): Observable<any> {
		return this.streams.videoMidPoint$.pipe(
			filter(({ state }) => this.helper.shouldPlayMidroll(state.depth)),
			tap(({ state }) => this.helper.playVideoAd('midroll', state.depth, state.correlator)),
		);
	}

	private beforeComplete(): Observable<any> {
		return this.streams.beforeComplete$.pipe(
			filter(({ state }) => this.helper.shouldPlayPostroll(state.depth)),
			tap(({ state }) => this.helper.playVideoAd('postroll', state.depth, state.correlator)),
		);
	}

	private complete(): Observable<any> {
		return this.streams.complete$.pipe(tap(() => this.helper.resetTrackerAdProduct()));
	}
}
