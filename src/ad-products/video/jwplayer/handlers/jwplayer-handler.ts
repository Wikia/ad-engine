// @ts-strict-ignore
import { utils } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { merge, Observable } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { JWPlayerHelper, JwplayerHelperSkippingSponsoredVideo } from '../helpers';
import { PlayerReadyResult } from '../helpers/player-ready-result';
import { videoDisplayTakeoverSynchronizer } from '../helpers/video-display-takeover-synchronizer';
import { JwpStream, ofJwpEvent } from '../streams/jwplayer-stream';

const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

/**
 * Describes what is done
 */
@Injectable({ scope: 'Transient' })
export class JWPlayerHandler {
	private stream$: JwpStream;
	private helper: JWPlayerHelper;

	handle({ jwplayer, adSlot, targeting, stream$ }: PlayerReadyResult): Observable<unknown> {
		this.stream$ = stream$;
		this.helper = new JwplayerHelperSkippingSponsoredVideo(adSlot, jwplayer, targeting);

		return merge(
			this.adError(),
			this.adRequest(),
			this.adImpression(),
			this.adsManager(),
			this.beforePlay(),
			this.videoMidPoint(),
			this.beforeComplete(),
		);
	}

	private adRequest(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('adRequest'),
			tap(({ state }) => {
				this.helper.emitVideoAdRequest();
				this.helper.updateVideoProperties(state);
			}),
		);
	}

	private adImpression(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('adImpression'),
			tap(({ state }) => {
				this.helper.setSlotParams(state.vastParams);
				this.helper.setSlotElementAttributes('success', state.vastParams);
				this.helper.emitVideoAdImpression();
				videoDisplayTakeoverSynchronizer.resolve(
					state.vastParams.lineItemId,
					state.vastParams.creativeId,
				);
			}),
		);
	}

	private adError(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('adError'),
			tap(({ payload, state }) => {
				log(`ad error message: ${payload.message}`);
				this.helper.setSlotParams(state.vastParams);
				this.helper.setSlotElementAttributes('error', state.vastParams);
				this.helper.emitVideoAdError(payload.adErrorCode);
				videoDisplayTakeoverSynchronizer.resolve();
			}),
		);
	}

	private adsManager(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('adsManager'),
			filter(() => this.helper.isIasTrackingEnabled()),
			tap(({ payload }) => this.helper.initIasVideoTracking(payload)),
		);
	}

	private beforePlay(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('beforePlay'),
			tap(({ state }) => this.helper.updateVideoProperties(state)),
			filter(({ state }) => {
				const shouldPlayAd = this.helper.shouldPlayPreroll(
					state.depth,
					state?.playlistItem?.mediaid,
				);

				if (!shouldPlayAd) {
					videoDisplayTakeoverSynchronizer.resolve();
				}

				return shouldPlayAd;
			}),
			mergeMap((payload) => this.helper.awaitIasTracking(payload)),
			tap(({ state }) => this.helper.playVideoAd('preroll', state)),
		);
	}

	private videoMidPoint(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('videoMidPoint'),
			filter(({ state }) =>
				this.helper.shouldPlayMidroll(state.depth, state?.playlistItem?.mediaid),
			),
			tap(({ state }) => this.helper.playVideoAd('midroll', state)),
		);
	}

	private beforeComplete(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('beforeComplete'),
			filter(({ state }) =>
				this.helper.shouldPlayPostroll(state.depth, state?.playlistItem?.mediaid),
			),
			tap(({ state }) => this.helper.playVideoAd('postroll', state)),
		);
	}
}
