import { RxJsOperator, VastParams, vastParser } from '@ad-engine/core';
import { merge as _merge } from 'lodash';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, scan, withLatestFrom } from 'rxjs/operators';
import { JWPlayer, JWPlayerEventParams, JWPlayerNoParamEvent } from './external-types/jwplayer';
import { JWPlayerEvent } from './external-types/jwplayer-event';
import { JWPlayerListItem } from './external-types/jwplayer-list-item';

export interface VideoDepth {
	depth: number;
	correlator: number;
}

export interface VastParamsEventUnion<TEvent> {
	event: TEvent;
	vastParams: VastParams;
}

export interface JWPlayerStreams {
	adRequest$: Observable<VastParamsEventUnion<JWPlayerEventParams['adRequest']>>;
	adError$: Observable<VastParamsEventUnion<JWPlayerEventParams['adError']>>;
	adImpression$: Observable<VastParamsEventUnion<JWPlayerEventParams['adImpression']>>;
	adBlock$: Observable<void>;
	adsManager$: Observable<JWPlayerEventParams['adsManager']>;
	beforePlay$: Observable<VideoDepth>;
	videoMidPoint$: Observable<VideoDepth>;
	beforeComplete$: Observable<VideoDepth>;
	complete$: Observable<void>;
}

/**
 * Describes streams (event sources) and their relations
 */
export function createJWPlayerStreams(jwplayer: JWPlayer): JWPlayerStreams {
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
): Observable<TEvent extends keyof JWPlayerEventParams ? JWPlayerEventParams[TEvent] : void> {
	return new Observable((observer) => {
		jwplayer.on(event as any, (param) => observer.next(param));
	});
}

function scanCorrelatorDepth<T>(): RxJsOperator<T, VideoDepth> {
	return (source: Observable<T>) =>
		source.pipe(
			scan(
				({ correlator, depth }) => ({
					correlator: Math.round(Math.random() * 10000000000),
					depth: depth + 1,
				}),
				{ correlator: 0, depth: 0 },
			),
		);
}

function supplementCorrelatorDepth<T>(
	beforePlay$: JWPlayerStreams['beforePlay$'],
): RxJsOperator<T, VideoDepth> {
	return (source: Observable<T>) =>
		source.pipe(
			withLatestFrom(beforePlay$),
			map(([, payload]) => payload),
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

function ensureEventTag<T extends JWPlayerEvent>(
	adRequest$: JWPlayerStreams['adRequest$'],
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

function supplementVastParams<T extends JWPlayerEvent>(): RxJsOperator<T, VastParamsEventUnion<T>> {
	return (source: Observable<T>) =>
		source.pipe(
			map((event) => ({
				event,
				vastParams: vastParser.parse(event.tag, {
					imaAd: event.ima && event.ima.ad,
				}),
			})),
		);
}
