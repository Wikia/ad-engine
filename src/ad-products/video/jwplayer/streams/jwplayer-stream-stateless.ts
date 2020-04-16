import { RxJsOperator } from '@ad-engine/core';
import { merge as _merge } from 'lodash';
import { merge, Observable, of } from 'rxjs';
import {
	distinctUntilChanged,
	filter,
	map,
	publish,
	refCount,
	withLatestFrom,
} from 'rxjs/operators';
import { JWPlayer, JWPlayerEventParams } from '../external-types/jwplayer';
import { JWPlayerEvent } from '../external-types/jwplayer-event';
import { JWPlayerListItem } from '../external-types/jwplayer-list-item';
import { JwpEventKey, JwpEventName, JwpNamedEvent } from './jwplayer-events';

export type JwpStatelessStream<T extends JwpEventKey = JwpEventName> = Observable<
	JwpStatelessEvent<T>
>;

export interface JwpStatelessEvent<TEvent extends JwpEventKey> extends JwpNamedEvent<TEvent> {
	payload: TEvent extends keyof JWPlayerEventParams ? JWPlayerEventParams[TEvent] : undefined;
}

export function ofJwpStatelessEvent<
	T extends JwpEventName[],
	P extends JwpStatelessEvent<T[number]>
>(...names: T): RxJsOperator<JwpStatelessEvent<any>, P> {
	return (source: Observable<any>) => source.pipe(filter(({ name }) => names.includes(name)));
}

/**
 * Creates stateless stream of jwplayer events.
 * Describes events and their relations.
 */
export function createJwpStatelessStream(jwplayer: JWPlayer): JwpStatelessStream {
	const init$: JwpStatelessStream<'init'> = of({ name: 'init', payload: undefined });
	const lateReady$: JwpStatelessStream<'lateReady'> = createLateReadyStream(jwplayer);
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
	const videoError$ = createJwpStream(jwplayer, 'error');

	return merge(
		init$,
		lateReady$,
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
		videoError$,
	);
}

function createLateReadyStream(jwplayer: JWPlayer): JwpStatelessStream<'lateReady'> {
	return jwplayer.getConfig().itemReady ? of({ name: 'lateReady', payload: undefined }) : of();
}

function createJwpStream<TEvent extends JwpEventKey>(
	jwplayer: JWPlayer,
	event: TEvent,
): JwpStatelessStream<TEvent> {
	return new Observable((observer) => {
		jwplayer.on(event as any, (param) => {
			observer.next({ name: event, payload: param });
		});
	}).pipe(publish(), refCount());
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
	adRequest$: JwpStatelessStream<'adRequest'>,
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
