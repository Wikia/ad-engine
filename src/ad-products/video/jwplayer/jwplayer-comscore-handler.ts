import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { JwpStream, ofJwpEvent } from './streams/jwplayer-stream';

export class JwplayerComscoreHandler {
	constructor(private stream$: JwpStream) {}

	handle(): Observable<unknown> {
		return this.stream$.pipe(
			ofJwpEvent('adStarted'),
			filter(({ state }) => state.adInVideo === 'preroll'),
			tap(() => {
				console.log('** Preroll Comscore Track');
			}),
		);
	}
}
