import { mapValues } from 'lodash';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { JWPlayer, JWPlayerEventKey } from '../external-types/jwplayer';
import { createJwpStateStream, JwpState } from './jwplayer-streams-state';
import { createJwpStatelessStreams, JwpStatelessEvent } from './jwplayer-streams-stateless';

export interface JwpStreams {
	adRequest$: Observable<JwpEvent<'adRequest'>>;
	adError$: Observable<JwpEvent<'adError'>>;
	adImpression$: Observable<JwpEvent<'adImpression'>>;
	adBlock$: Observable<JwpEvent<'adBlock'>>;
	adsManager$: Observable<JwpEvent<'adsManager'>>;
	beforePlay$: Observable<JwpEvent<'beforePlay'>>;
	videoMidPoint$: Observable<JwpEvent<'videoMidPoint'>>;
	beforeComplete$: Observable<JwpEvent<'beforeComplete'>>;
	complete$: Observable<JwpEvent<'complete'>>;
	// TODO
	ready$?: Observable<JwpEvent<'ready'>>;
	adClick$?: Observable<JwpEvent<'adClick'>>;
	adStarted$?: Observable<JwpEvent<'adStarted'>>;
	adViewableImpression$?: Observable<JwpEvent<'adViewableImpression'>>;
	adFirstQuartile$?: Observable<JwpEvent<'adFirstQuartile'>>;
	adMidPoint$?: Observable<JwpEvent<'adMidPoint'>>;
	adThirdQuartile$?: Observable<JwpEvent<'adThirdQuartile'>>;
	adComplete$?: Observable<JwpEvent<'adComplete'>>;
	adSkipped$?: Observable<JwpEvent<'adSkipped'>>;
	videoStart$?: Observable<JwpEvent<'videoStart'>>;
}

export interface JwpEvent<TEvent extends JWPlayerEventKey> extends JwpStatelessEvent<TEvent> {
	state: JwpState;
}

export function createJwpStreams(jwplayer: JWPlayer): JwpStreams {
	const statelessStreams = createJwpStatelessStreams(jwplayer);
	const state$ = createJwpStateStream(statelessStreams);

	return mapValues(statelessStreams, (value$: Observable<any>) =>
		value$.pipe(
			withLatestFrom(state$),
			map(([value, state]) => ({ ...value, state })),
		),
	);
}
