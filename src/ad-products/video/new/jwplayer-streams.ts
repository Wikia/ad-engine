import { merge as _merge } from 'lodash';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, scan, withLatestFrom } from 'rxjs/operators';
import { JWPlayer, JWPlayerEventParams, JWPlayerNoParamEvent } from './jwplayer-plugin/jwplayer';
import { JWPlayerListItem } from './jwplayer-plugin/jwplayer-list-item';

export interface JWPlayerStreams {
	adRequest$: Observable<JWPlayerEventParams['adRequest']>;
	adError$: Observable<JWPlayerEventParams['adError']>;
	adImpression$: Observable<JWPlayerEventParams['adImpression']>;
	adBlock$: Observable<void>;
	beforePlay$: Observable<{ depth: number; correlator: number }>;
	videoMidPoint$: Observable<{ depth: number; correlator: number }>;
	beforeComplete$: Observable<{ depth: number; correlator: number }>;
	complete$: Observable<void>;
}

export function createJWPlayerStreams(jwplayer: JWPlayer): JWPlayerStreams {
	const adRequest$ = createStream(jwplayer, 'adRequest');
	const adError$ = createStream(jwplayer, 'adError').pipe(ensureEventTag(adRequest$));
	const adImpression$ = createStream(jwplayer, 'adImpression');
	const adBlock$ = createStream(jwplayer, 'adBlock');
	const beforePlay$ = createStream(jwplayer, 'beforePlay').pipe(
		onlyOncePerVideo(jwplayer),
		scan(
			({ correlator, depth }) => ({
				correlator: Math.round(Math.random() * 10000000000),
				depth: depth + 1,
			}),
			{ correlator: 0, depth: 0 },
		),
	);
	const videoMidPoint$ = createStream(jwplayer, 'videoMidPoint').pipe(
		withLatestFrom(beforePlay$),
		map(([, payload]) => payload),
	);
	const beforeComplete$ = createStream(jwplayer, 'beforeComplete').pipe(
		withLatestFrom(beforePlay$),
		map(([, payload]) => payload),
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

function onlyOncePerVideo<T>(jwplayer: JWPlayer): (source: Observable<T>) => Observable<T> {
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
