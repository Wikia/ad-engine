import { context } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { EMPTY, Observable } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';
import { PlayerReadyResult } from '../helpers/player-ready-result';
import { ofJwpEvent } from '../streams/jwplayer-stream';

interface ComscorePayload {
	c1: string;
	c2: number;
	c5: string;
}

@Injectable({ scope: 'Transient' })
export class JwplayerComscoreHandler {
	handle({ stream$ }: PlayerReadyResult): Observable<unknown> {
		if (!this.isEnabled()) {
			return EMPTY;
		}

		return stream$.pipe(
			ofJwpEvent('adStarted'),
			filter(({ state }) => state.adInVideo === 'preroll'),
			map(() => ({
				c1: '1',
				c2: 6177433,
				c5: '09',
			})),
			mergeMap((payload) => this.track(payload)),
		);
	}

	private isEnabled(): boolean {
		if (!context.get('options.video.comscoreJwpTracking')) {
			return false;
		}

		if (context.get('options.geoRequiresConsent')) {
			return context.get('options.trackingOptIn');
		}

		if (context.get('options.geoRequiresSignal')) {
			return context.get('options.optOutSale');
		}

		return true;
	}

	private track(payload: ComscorePayload): Observable<unknown> {
		const url = `${
			document.location.protocol === 'https:' ? 'https://sb' : 'http://b'
		}.scorecardresearch.com/b2?c1=${payload.c1}&c2=${payload.c2}&c5=${payload.c5}`;

		return ajax.get(url).pipe(
			catchError((error) => {
				console.error(error);

				return EMPTY;
			}),
		);
	}
}
