import { utils } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { merge, Observable } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { JWPlayerHelper } from '../helpers/jwplayer-helper';
import { PlayerReadyResult } from '../helpers/player-ready-result';
import { JWPlayerA9Logger } from '../jwplayer-a9-logger';
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
		this.helper = new JWPlayerHelper(adSlot, jwplayer, targeting);

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

	private adError(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('adError'),
			tap(({ payload, state }) => {
				log(`ad error message: ${payload.message}`);
				this.helper.setSlotParams(state.vastParams);
				this.helper.setSlotElementAttributes('error', state.vastParams);
				this.helper.emitVideoAdError(payload.adErrorCode);
				JWPlayerA9Logger.log(payload);
			}),
		);
	}

	private adRequest(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('adRequest'),
			tap(({ state }) => {
				this.helper.setSlotElementAttributes('success', state.vastParams);
				this.helper.emitVideoAdRequest();
			}),
		);
	}

	private adImpression(): Observable<unknown> {
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
			filter(({ state }) => this.helper.shouldPlayPreroll(state.depth)),
			mergeMap((payload) => this.helper.awaitIasTracking(payload)),
			tap(({ state }) => this.helper.playVideoAd('preroll', state)),
		);
	}

	private videoMidPoint(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('videoMidPoint'),
			filter(({ state }) => this.helper.shouldPlayMidroll(state.depth)),
			tap(({ state }) => this.helper.playVideoAd('midroll', state)),
		);
	}

	private beforeComplete(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('beforeComplete'),
			filter(({ state }) => this.helper.shouldPlayPostroll(state.depth)),
			tap(({ state }) => this.helper.playVideoAd('postroll', state)),
		);
	}
}
