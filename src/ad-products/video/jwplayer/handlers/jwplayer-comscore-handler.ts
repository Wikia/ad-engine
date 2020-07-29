import { context } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { EMPTY, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
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
			tap(() => {
				const payload = {
					c1: '1',
					c2: 6177433,
					c5: '09',
				};

				this.track(payload);
			}),
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

	private track(payload: ComscorePayload): void {
		(window as any).COMSCORE?.beacon(payload);
	}
}
