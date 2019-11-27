import { merge as _merge } from 'lodash';
import { merge, Observable, of } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { JWPlayer, JWPlayerEventParams, JWPlayerNoParamEvent } from './jwplayer-plugin/jwplayer';

export interface JWPlayerStreams {
	adRequest$: Observable<JWPlayerEventParams['adRequest']>;
	adError$: Observable<JWPlayerEventParams['adError']>;
}

export function createJWPlayerStreams(jwplayer: JWPlayer): JWPlayerStreams {
	const adRequest$ = createStream(jwplayer, 'adRequest');
	const adError$ = createStream(jwplayer, 'adError').pipe(ensureEventTag(adRequest$));

	return {
		adError$,
		adRequest$,
	};
}

function createStream<TEvent extends keyof JWPlayerEventParams | keyof JWPlayerNoParamEvent>(
	jwplayer: JWPlayer,
	event: TEvent,
): Observable<TEvent extends keyof JWPlayerEventParams ? JWPlayerEventParams[TEvent] : void> {
	return new Observable((observer) => {
		jwplayer.on(event as any, (param) => observer.next(param));
	});
}

function ensureEventTag<T>(
	adRequest$: Observable<JWPlayerEventParams['adRequest']>,
): (source: Observable<T>) => Observable<T> {
	const base$ = merge(of({ event: { tag: null } }), adRequest$);

	return (source: Observable<T>) =>
		source.pipe(
			withLatestFrom(base$),
			map(([adError, adRequest]) => _merge(adRequest, adError)),
		);
}
