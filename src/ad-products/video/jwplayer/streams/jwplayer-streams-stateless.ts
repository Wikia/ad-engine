import { RxJsOperator, VastParams, vastParser } from '@ad-engine/core';
import { merge as _merge } from 'lodash';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, scan, withLatestFrom } from 'rxjs/operators';
import { JWPlayer, JWPlayerEventParams, JWPlayerNoParamEvent } from '../external-types/jwplayer';
import { JWPlayerEvent } from '../external-types/jwplayer-event';
import { JWPlayerListItem } from '../external-types/jwplayer-list-item';

export interface JwpStatelessStreams {
	adRequest$: Observable<JwpStatelessStream<'adRequest'> & VastParamsObject>;
	adError$: Observable<JwpStatelessStream<'adError'> & VastParamsObject>;
	adImpression$: Observable<JwpStatelessStream<'adImpression'> & VastParamsObject>;
	adBlock$: Observable<JwpStatelessStream<'adBlock'>>;
	adsManager$: Observable<JwpStatelessStream<'adsManager'>>;
	beforePlay$: Observable<JwpStatelessStream<'beforePlay'> & VideoDepth>;
	videoMidPoint$: Observable<JwpStatelessStream<'videoMidPoint'> & VideoDepth>;
	beforeComplete$: Observable<JwpStatelessStream<'beforeComplete'> & VideoDepth>;
	complete$: Observable<JwpStatelessStream<'complete'>>;
	// TODO
	ready$?: Observable<JwpStatelessStream<'ready'>>;
	adClick$?: Observable<JwpStatelessStream<'adClick'>>;
	adStarted$?: Observable<JwpStatelessStream<'adStarted'>>;
	adViewableImpression$?: Observable<JwpStatelessStream<'adViewableImpression'>>; // needs supplementVastParams
	adFirstQuartile$?: Observable<JwpStatelessStream<'adFirstQuartile'>>;
	adMidPoint$?: Observable<JwpStatelessStream<'adMidPoint'>>;
	adThirdQuartile$?: Observable<JwpStatelessStream<'adThirdQuartile'>>;
	adComplete$?: Observable<JwpStatelessStream<'adComplete'>>;
	adSkipped$?: Observable<JwpStatelessStream<'adSkipped'>>;
	videoStart$?: Observable<JwpStatelessStream<'videoStart'>>;
}

export interface JwpStatelessStream<
	TEvent extends keyof JWPlayerEventParams | JWPlayerNoParamEvent
> {
	eventName: string;
	event: TEvent extends keyof JWPlayerEventParams ? JWPlayerEventParams[TEvent] : undefined;
}

interface VastParamsObject {
	vastParams: VastParams;
}

export interface VideoDepth {
	depth: number;
	correlator: number;
}

/**
 * Describes streams (event sources) and their relations
 */
export function createJwpStatelessStreams(jwplayer: JWPlayer): JwpStatelessStreams {
	const adRequest$ = createJwpStream(jwplayer, 'adRequest').pipe(supplementVastParams());
	const adError$ = createJwpStream(jwplayer, 'adError').pipe(
		onlyOncePerVideo(jwplayer),
		ensureEventTag(adRequest$),
		supplementVastParams(),
	);
	const adImpression$ = createJwpStream(jwplayer, 'adImpression').pipe(supplementVastParams());
	const adBlock$ = createJwpStream(jwplayer, 'adBlock');
	const adsManager$ = createJwpStream(jwplayer, 'adsManager');
	const beforePlay$ = createJwpStream(jwplayer, 'beforePlay').pipe(
		onlyOncePerVideo(jwplayer),
		scanCorrelatorDepth(),
	);
	const videoMidPoint$ = createJwpStream(jwplayer, 'videoMidPoint').pipe(
		supplementCorrelatorDepth(beforePlay$),
	);
	const beforeComplete$ = createJwpStream(jwplayer, 'beforeComplete').pipe(
		supplementCorrelatorDepth(beforePlay$),
	);
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
): Observable<JwpStatelessStream<TEvent>> {
	return new Observable((observer) => {
		jwplayer.on(event as any, (param) => observer.next({ eventName: event, event: param }));
	});
}

function scanCorrelatorDepth<T extends object>(): RxJsOperator<T, T & VideoDepth> {
	return (source: Observable<T>) =>
		source.pipe(
			scan<T & VideoDepth>(
				({ correlator, depth }, value: T) => ({
					...value,
					correlator: Math.round(Math.random() * 10000000000),
					depth: depth + 1,
				}),
				{ correlator: 0, depth: 0 } as T & VideoDepth,
			),
		);
}

function supplementCorrelatorDepth<T>(
	beforePlay$: Observable<VideoDepth>,
): RxJsOperator<T, T & VideoDepth> {
	return (source: Observable<T>) =>
		source.pipe(
			withLatestFrom(beforePlay$),
			map(([original, payload]) => ({
				...original,
				depth: payload.depth,
				correlator: payload.correlator,
			})),
		);
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

function supplementVastParams<T extends { event: JWPlayerEvent }>(): RxJsOperator<
	T,
	T & VastParamsObject
> {
	return (source: Observable<T>) =>
		source.pipe(
			map((value) => ({
				...value,
				vastParams: vastParser.parse(value.event.tag, {
					imaAd: value.event.ima && value.event.ima.ad,
				}),
			})),
		);
}
