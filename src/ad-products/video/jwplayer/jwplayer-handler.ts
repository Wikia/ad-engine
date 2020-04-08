import { utils } from '@ad-engine/core';
import { merge, Observable } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { JWPlayerHelper } from './helpers/jwplayer-helper';
import { JWPlayerTrackingHelper } from './helpers/jwplayer-tracking-helper';
import { JwpStream, ofJwpEvent } from './streams/jwplayer-stream';

const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

/**
 * Describes what is done
 */
export class JWPlayerHandler {
	constructor(
		private stream$: JwpStream,
		private helper: JWPlayerHelper,
		private tracker: JWPlayerTrackingHelper,
	) {}

	handle(): Observable<any> {
		return merge(
			this.adError(),
			this.adRequest(),
			this.adImpression(),
			this.adsManager(),
			this.beforePlay(),
			this.videoMidPoint(),
			this.beforeComplete(),
			this.track(),
		);
	}

	private adError(): Observable<any> {
		return this.stream$.pipe(
			ofJwpEvent('adError'),
			tap(({ payload, state }) => {
				log(`ad error message: ${payload.message}`);
				this.helper.setSlotParams(state.vastParams);
				this.helper.setSlotElementAttributes('error', state.vastParams);
				this.helper.emitVideoAdError(payload.adErrorCode);
			}),
		);
	}

	private adRequest(): Observable<any> {
		return this.stream$.pipe(
			ofJwpEvent('adRequest'),
			tap(({ state }) => {
				this.helper.setSlotElementAttributes('success', state.vastParams);
				this.helper.emitVideoAdRequest();
			}),
		);
	}

	private adImpression(): Observable<any> {
		return this.stream$.pipe(
			ofJwpEvent('adImpression'),
			tap(({ state }) => {
				this.helper.setSlotParams(state.vastParams);
				this.helper.emitVideoAdImpression();
			}),
			filter(() => this.helper.isMoatTrackingEnabled()),
			tap(({ payload }) => this.helper.trackMoat(payload)),
		);
	}

	private adsManager(): Observable<any> {
		return this.stream$.pipe(
			ofJwpEvent('adsManager'),
			filter(() => this.helper.isIasTrackingEnabled()),
			tap((event) => this.helper.initIasVideoTracking(event)),
		);
	}

	private beforePlay(): Observable<any> {
		return this.stream$.pipe(
			ofJwpEvent('beforePlay'),
			tap(({ state }) => this.helper.updateVideoProperties(state)),
			filter(({ state }) => this.helper.shouldPlayPreroll(state.depth)),
			mergeMap((payload) => this.helper.awaitIasTracking(payload)),
			tap(({ state }) => this.helper.playVideoAd('preroll', state)),
		);
	}

	private videoMidPoint(): Observable<any> {
		return this.stream$.pipe(
			ofJwpEvent('videoMidPoint'),
			filter(({ state }) => this.helper.shouldPlayMidroll(state.depth)),
			tap(({ state }) => this.helper.playVideoAd('midroll', state)),
		);
	}

	private beforeComplete(): Observable<any> {
		return this.stream$.pipe(
			ofJwpEvent('beforeComplete'),
			filter(({ state }) => this.helper.shouldPlayPostroll(state.depth)),
			tap(({ state }) => this.helper.playVideoAd('postroll', state)),
		);
	}

	private track(): Observable<any> {
		return this.stream$.pipe(
			filter((event) => this.tracker.isTrackingEvent(event)),
			tap((event) => this.tracker.track(event)),
		);
	}
}
