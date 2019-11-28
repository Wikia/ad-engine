import { VastParams, vastParser } from '@ad-engine/core';
import { merge as _merge } from 'lodash';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, scan, withLatestFrom } from 'rxjs/operators';
import { JWPlayer, JWPlayerEventParams, JWPlayerNoParamEvent } from './jwplayer-plugin/jwplayer';
import { JWPlayerEvent } from './jwplayer-plugin/jwplayer-event';
import { JWPlayerListItem } from './jwplayer-plugin/jwplayer-list-item';

type RxJsOperator<TSource, TResult> = (source: Observable<TSource>) => Observable<TResult>;

export interface JWPlayerStreams {
	adRequest$: Observable<{ event: JWPlayerEventParams['adRequest']; vastParams: VastParams }>;
	adError$: Observable<{ event: JWPlayerEventParams['adError']; vastParams: VastParams }>;
	adImpression$: Observable<{ event: JWPlayerEventParams['adImpression']; vastParams: VastParams }>;
	adBlock$: Observable<void>;
	beforePlay$: Observable<{ depth: number; correlator: number }>;
	videoMidPoint$: Observable<{ depth: number; correlator: number }>;
	beforeComplete$: Observable<{ depth: number; correlator: number }>;
	complete$: Observable<void>;
}

export function createJWPlayerStreams(jwplayer: JWPlayer): JWPlayerStreams {
	const adRequest$ = createStream(jwplayer, 'adRequest').pipe(supplementVastParams());
	const adError$ = createStream(jwplayer, 'adError').pipe(
		onlyOncePerVideo(jwplayer),
		supplementVastParams(),
		ensureEventTag(adRequest$),
	);
	const adImpression$ = createStream(jwplayer, 'adImpression').pipe(supplementVastParams());
	const adBlock$ = createStream(jwplayer, 'adBlock');
	const beforePlay$ = createStream(jwplayer, 'beforePlay').pipe(
		onlyOncePerVideo(jwplayer),
		scanCorrelatorDepth(),
	);
	const videoMidPoint$ = createStream(jwplayer, 'videoMidPoint').pipe(
		supplementCorrelatorDepth(beforePlay$),
	);
	const beforeComplete$ = createStream(jwplayer, 'beforeComplete').pipe(
		supplementCorrelatorDepth(beforePlay$),
	);
	const complete$ = createStream(jwplayer, 'complete');

	return {
		adError$,
		adRequest$,
		adImpression$,
		adBlock$,
		beforePlay$,
		videoMidPoint$,
		beforeComplete$,
		complete$,
	};
}

function createStream<TEvent extends keyof JWPlayerEventParams | JWPlayerNoParamEvent>(
	jwplayer: JWPlayer,
	event: TEvent,
): Observable<TEvent extends keyof JWPlayerEventParams ? JWPlayerEventParams[TEvent] : void> {
	return new Observable((observer) => {
		jwplayer.on(event as any, (param) => observer.next(param));
	});
}

function ensureEventTag<T>(adRequest$: JWPlayerStreams['adRequest$']): RxJsOperator<T, T> {
	const base$ = merge(of({ event: { event: { tag: null } } }), adRequest$);

	return (source: Observable<T>) =>
		source.pipe(
			withLatestFrom(base$),
			map(([adError, adRequest]) => _merge(adRequest, adError)),
		);
}

function scanCorrelatorDepth<T>(): RxJsOperator<T, { depth: number; correlator: number }> {
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
): RxJsOperator<T, { depth: number; correlator: number }> {
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

function supplementVastParams<T extends JWPlayerEvent>(): RxJsOperator<
	T,
	{ event: T; vastParams: VastParams }
> {
	return (source) =>
		source.pipe(
			map((event) => ({
				event,
				vastParams: vastParser.parse(event.tag, {
					imaAd: event.ima && event.ima.ad,
				}),
			})),
		);
}
