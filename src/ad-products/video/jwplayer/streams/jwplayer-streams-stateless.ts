import { RxJsOperator } from '@ad-engine/core';
import { merge as _merge } from 'lodash';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';
import { JWPlayer, JWPlayerEventParams, JWPlayerNoParamEvent } from '../external-types/jwplayer';
import { JWPlayerEvent } from '../external-types/jwplayer-event';
import { JWPlayerListItem } from '../external-types/jwplayer-list-item';

export interface JwpStatelessStreams {
	adRequest$: Observable<JwpStatelessEvent<'adRequest'>>;
	adError$: Observable<JwpStatelessEvent<'adError'>>;
	adImpression$: Observable<JwpStatelessEvent<'adImpression'>>;
	adBlock$: Observable<JwpStatelessEvent<'adBlock'>>;
	adsManager$: Observable<JwpStatelessEvent<'adsManager'>>;
	beforePlay$: Observable<JwpStatelessEvent<'beforePlay'>>;
	videoMidPoint$: Observable<JwpStatelessEvent<'videoMidPoint'>>;
	beforeComplete$: Observable<JwpStatelessEvent<'beforeComplete'>>;
	complete$: Observable<JwpStatelessEvent<'complete'>>;
	// TODO
	ready$?: Observable<JwpStatelessEvent<'ready'>>;
	adClick$?: Observable<JwpStatelessEvent<'adClick'>>;
	adStarted$?: Observable<JwpStatelessEvent<'adStarted'>>;
	adViewableImpression$?: Observable<JwpStatelessEvent<'adViewableImpression'>>; // needs supplementVastParams
	adFirstQuartile$?: Observable<JwpStatelessEvent<'adFirstQuartile'>>;
	adMidPoint$?: Observable<JwpStatelessEvent<'adMidPoint'>>;
	adThirdQuartile$?: Observable<JwpStatelessEvent<'adThirdQuartile'>>;
	adComplete$?: Observable<JwpStatelessEvent<'adComplete'>>;
	adSkipped$?: Observable<JwpStatelessEvent<'adSkipped'>>;
	videoStart$?: Observable<JwpStatelessEvent<'videoStart'>>;
}

export interface JwpStatelessEvent<
	TEvent extends keyof JWPlayerEventParams | JWPlayerNoParamEvent
> {
	eventName: string;
	event: TEvent extends keyof JWPlayerEventParams ? JWPlayerEventParams[TEvent] : undefined;
}

/**
 * Describes streams (event sources) and their relations
 */
export function createJwpStatelessStreams(jwplayer: JWPlayer): JwpStatelessStreams {
	const adRequest$ = createJwpStream(jwplayer, 'adRequest');
	const adError$ = createJwpStream(jwplayer, 'adError').pipe(
		onlyOncePerVideo(jwplayer),
		ensureEventTag(adRequest$),
	);
	const adImpression$ = createJwpStream(jwplayer, 'adImpression');
	const adBlock$ = createJwpStream(jwplayer, 'adBlock');
	const adsManager$ = createJwpStream(jwplayer, 'adsManager');
	const beforePlay$ = createJwpStream(jwplayer, 'beforePlay').pipe(onlyOncePerVideo(jwplayer));
	const videoMidPoint$ = createJwpStream(jwplayer, 'videoMidPoint');
	const beforeComplete$ = createJwpStream(jwplayer, 'beforeComplete');
	const complete$ = createJwpStream(jwplayer, 'complete');

	return {
		adError$,
		adRequest$,
		adImpression$,
		adBlock$,
		adsManager$,
		beforePlay$,
		videoMidPoint$,
		beforeComplete$,
		complete$,
	};
}

function createJwpStream<TEvent extends keyof JWPlayerEventParams | JWPlayerNoParamEvent>(
	jwplayer: JWPlayer,
	event: TEvent,
): Observable<JwpStatelessEvent<TEvent>> {
	return new Observable((observer) => {
		jwplayer.on(event as any, (param) => observer.next({ eventName: event, event: param }));
	});
}

function onlyOncePerVideo<T>(jwplayer: JWPlayer): RxJsOperator<T, T> {
	return (source: Observable<T>) =>
		source.pipe(
			map((payload) => ({
				payload,
				playlistItem: jwplayer.getPlaylistItem() || ({} as JWPlayerListItem),
			})),
			distinctUntilChanged((a, b) => a.playlistItem.mediaid === b.playlistItem.mediaid),
			map(({ payload }) => payload),
		);
}

function ensureEventTag<T extends { event: JWPlayerEvent }>(
	adRequest$: JwpStatelessStreams['adRequest$'],
): RxJsOperator<T, T> {
	const base$ = merge(
		of({ event: { tag: null } }),
		adRequest$.pipe(map((adRequest) => adRequest.event)),
	);

	return (source: Observable<T>) =>
		source.pipe(
			withLatestFrom(base$),
			map(([jwplayerEvent, adRequestEvent]) => _merge(adRequestEvent, jwplayerEvent)),
		);
}
