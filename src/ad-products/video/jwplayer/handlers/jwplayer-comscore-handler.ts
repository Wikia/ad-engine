import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { PlayerReadyResult } from '../helpers/player-ready-result';
import { JwpStream, ofJwpEvent } from '../streams/jwplayer-stream';

export class JwplayerComscoreHandler {
	private stream$: JwpStream;

	constructor({ stream$ }: PlayerReadyResult) {
		this.stream$ = stream$;
	}

	handle(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('adStarted'),
			filter(({ state }) => state.adInVideo === 'preroll'),
			tap(() => {
				// tslint:disable-next-line:no-console
				console.log('** Preroll Comscore Track');
			}),
		);
	}
}
