import { RxJsOperator, VastParams, vastParser } from '@ad-engine/core';
import { combineLatest, merge, Observable } from 'rxjs';
import { map, scan, shareReplay, startWith, withLatestFrom } from 'rxjs/operators';
import { JWPlayer } from '../external-types/jwplayer';
import { JWPlayerConfig } from '../external-types/jwplayer-config';
import { JWPlayerEvent } from '../external-types/jwplayer-event';
import { JWPlayerListItem } from '../external-types/jwplayer-list-item';
import { JwpStatelessStream, ofJwpStatelessEvent } from './jwplayer-stream-stateless';

interface VideoDepth {
	depth: number;
	correlator: number;
}

export interface JwpState extends VideoDepth {
	vastParams: VastParams;
	playlistItem: JWPlayerListItem;
	config: JWPlayerConfig;
	mute: boolean;
	rv: number;
	adInVideo: 'bootstrap' | 'none' | 'preroll' | 'midroll' | 'postroll';
}

/**
 * Creates jwplayer state stream.
 * If there is a need for additional data in the stream, this is a place to add it.
 * It ensures that data attached to event is reflecting the state of things at the time of that event.
 */
export function createJwpStateStream(
	stream$: JwpStatelessStream,
	jwplayer: JWPlayer,
): Observable<JwpState> {
	const videoDepth$: Observable<VideoDepth> = stream$.pipe(
		ofJwpStatelessEvent('beforePlay'),
		scanCorrelatorDepth(),
		startWith({ depth: 0, correlator: 0 }),
	);
	const adRequestsCount$: Observable<number> = merge(
		stream$.pipe(ofJwpStatelessEvent('adRequest'), scanAdRequestCount(), startWith(1)),
	);
	const vastParams$: Observable<VastParams> = stream$.pipe(
		ofJwpStatelessEvent('adRequest', 'adError', 'adImpression'),
		createVastParams(),
		startWith(vastParser.parse(null)),
	);
	const videoStage$ = merge(
		stream$.pipe(
			ofJwpStatelessEvent('beforePlay'),
			map(() => 'preroll'),
		),
		stream$.pipe(
			ofJwpStatelessEvent('videoMidPoint'),
			map(() => 'midroll'),
		),
		stream$.pipe(
			ofJwpStatelessEvent('beforeComplete'),
			map(() => 'postroll'),
		),
	);
	const adInVideo$: Observable<JwpState['adInVideo']> = merge(
		stream$.pipe(
			ofJwpStatelessEvent('adStarted'),
			withLatestFrom(videoStage$),
			map(([, videoStatus]) => videoStatus),
		),
		stream$.pipe(
			ofJwpStatelessEvent('complete'),
			map(() => 'none'),
			startWith('bootstrap'),
		),
	) as any;
	const common$ = stream$.pipe(
		map(() => {
			const playlistItem =
				jwplayer.getPlaylistItem() ||
				({ sources: [], tracks: [], variations: [], images: [], allSources: [] } as any);

			return {
				playlistItem,
				config: jwplayer.getConfig(),
				mute: jwplayer.getMute(),
			};
		}),
	);

	return combineLatest([videoDepth$, adRequestsCount$, vastParams$, adInVideo$, common$]).pipe(
		map(([videoDepth, adRequestsCount, vastParams, adInVideo, common]) => ({
			...common,
			...videoDepth,
			vastParams,
			adInVideo,
			rv: adRequestsCount,
		})),
		shareReplay(1),
	);
}

function scanCorrelatorDepth<T>(): RxJsOperator<T, VideoDepth> {
	return (source: Observable<T>) =>
		source.pipe(
			scan(
				(currentState) => ({
					correlator: Math.round(Math.random() * 10000000000),
					depth: currentState.depth + 1,
				}),
				{ correlator: 0, depth: 0 },
			),
		);
}

function scanAdRequestCount<T>(): RxJsOperator<T, number> {
	return (source: Observable<T>) => source.pipe(scan((currentCount) => currentCount + 1, 0));
}

function createVastParams<T extends { payload: JWPlayerEvent }>(): RxJsOperator<T, VastParams> {
	return (source: Observable<T>) =>
		source.pipe(
			map((event: { payload: JWPlayerEvent }) =>
				vastParser.parse(event.payload.tag, {
					imaAd: event.payload.ima && event.payload.ima.ad,
				}),
			),
		);
}
