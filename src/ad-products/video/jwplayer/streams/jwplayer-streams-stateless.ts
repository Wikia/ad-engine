import { RxJsOperator } from '@ad-engine/core';
import { merge as _merge } from 'lodash';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';
import { JWPlayer, JWPlayerEventKey, JWPlayerEventParams } from '../external-types/jwplayer';
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
	ready$: Observable<JwpStatelessEvent<'ready'>>;
	adClick$: Observable<JwpStatelessEvent<'adClick'>>;
	adStarted$: Observable<JwpStatelessEvent<'adStarted'>>;
	adViewableImpression$: Observable<JwpStatelessEvent<'adViewableImpression'>>; // needs supplementVastParams
	adFirstQuartile$: Observable<JwpStatelessEvent<'adFirstQuartile'>>;
	adMidPoint$: Observable<JwpStatelessEvent<'adMidPoint'>>;
	adThirdQuartile$: Observable<JwpStatelessEvent<'adThirdQuartile'>>;
	adComplete$: Observable<JwpStatelessEvent<'adComplete'>>;
	adSkipped$: Observable<JwpStatelessEvent<'adSkipped'>>;
	videoStart$: Observable<JwpStatelessEvent<'videoStart'>>;
}

export interface JwpStatelessEvent<TEvent extends JWPlayerEventKey> {
	name: TEvent;
	payload: TEvent extends keyof JWPlayerEventParams ? JWPlayerEventParams[TEvent] : undefined;
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
	const ready$ = createJwpStream(jwplayer, 'ready');
	const adClick$ = createJwpStream(jwplayer, 'adClick');
	const adStarted$ = createJwpStream(jwplayer, 'adStarted');
	const adViewableImpression$ = createJwpStream(jwplayer, 'adViewableImpression');
	const adFirstQuartile$ = createJwpStream(jwplayer, 'adFirstQuartile');
	const adMidPoint$ = createJwpStream(jwplayer, 'adMidPoint');
	const adThirdQuartile$ = createJwpStream(jwplayer, 'adThirdQuartile');
	const adComplete$ = createJwpStream(jwplayer, 'adComplete');
	const adSkipped$ = createJwpStream(jwplayer, 'adSkipped');
	const videoStart$ = createJwpStream(jwplayer, 'videoStart');

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
		ready$,
		adClick$,
		adStarted$,
		adViewableImpression$,
		adFirstQuartile$,
		adMidPoint$,
		adThirdQuartile$,
		adComplete$,
		adSkipped$,
		videoStart$,
	};
}

function createJwpStream<TEvent extends JWPlayerEventKey>(
	jwplayer: JWPlayer,
	event: TEvent,
): Observable<JwpStatelessEvent<TEvent>> {
	return new Observable((observer) => {
		jwplayer.on(event as any, (param) => observer.next({ name: event, payload: param }));
	});
}

function onlyOncePerVideo<T>(jwplayer: JWPlayer): RxJsOperator<T, T> {
	return (source: Observable<T>) =>
		source.pipe(
			map((event) => ({
				event,
				playlistItem: jwplayer.getPlaylistItem() || ({} as JWPlayerListItem),
			})),
			distinctUntilChanged((a, b) => a.playlistItem.mediaid === b.playlistItem.mediaid),
			map(({ event }) => event),
		);
}

function ensureEventTag<T extends { payload: JWPlayerEvent }>(
	adRequest$: JwpStatelessStreams['adRequest$'],
): RxJsOperator<T, T> {
	const base$ = merge(
		of({ payload: { tag: null } }),
		adRequest$.pipe(map((adRequest) => adRequest.payload)),
	);

	return (source: Observable<T>) =>
		source.pipe(
			withLatestFrom(base$),
			map(([jwplayerEvent, adRequestEvent]) => _merge(adRequestEvent, jwplayerEvent)),
		);
}
