import { Observable } from 'rxjs';
import { JWPlayer, JWPlayerEventParams, JWPlayerNoParamEvent } from '../external-types/jwplayer';
import { JwpState } from './jwplayer-streams-state';
import { JwpStatelessStream } from './jwplayer-streams-stateless';

export interface JwpStreams {
	adRequest$: Observable<JwpStream<'adRequest'>>;
	adError$: Observable<JwpStream<'adError'>>;
	adImpression$: Observable<JwpStream<'adImpression'>>;
	adBlock$: Observable<JwpStream<'adBlock'>>;
	adsManager$: Observable<JwpStream<'adsManager'>>;
	beforePlay$: Observable<JwpStream<'beforePlay'>>;
	videoMidPoint$: Observable<JwpStream<'videoMidPoint'>>;
	beforeComplete$: Observable<JwpStream<'beforeComplete'>>;
	complete$: Observable<JwpStream<'complete'>>;
	// TODO
	ready$?: Observable<JwpStream<'ready'>>;
	adClick$?: Observable<JwpStream<'adClick'>>;
	adStarted$?: Observable<JwpStream<'adStarted'>>;
	adViewableImpression$?: Observable<JwpStream<'adViewableImpression'>>;
	adFirstQuartile$?: Observable<JwpStream<'adFirstQuartile'>>;
	adMidPoint$?: Observable<JwpStream<'adMidPoint'>>;
	adThirdQuartile$?: Observable<JwpStream<'adThirdQuartile'>>;
	adComplete$?: Observable<JwpStream<'adComplete'>>;
	adSkipped$?: Observable<JwpStream<'adSkipped'>>;
	videoStart$?: Observable<JwpStream<'videoStart'>>;
}

interface JwpStream<TEvent extends keyof JWPlayerEventParams | JWPlayerNoParamEvent>
	extends JwpStatelessStream<TEvent> {
	state: JwpState;
}

export function createJwpStreams(jwPlayer: JWPlayer): JwpStreams {}
