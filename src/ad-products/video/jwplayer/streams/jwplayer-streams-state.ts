import { RxJsOperator, VastParams, vastParser } from '@ad-engine/core';
import { combineLatest, merge, Observable } from 'rxjs';
import { map, scan, shareReplay, startWith, withLatestFrom } from 'rxjs/operators';
import { JWPlayer } from '../external-types/jwplayer';
import { JWPlayerConfig } from '../external-types/jwplayer-config';
import { JWPlayerEvent } from '../external-types/jwplayer-event';
import { JWPlayerListItem } from '../external-types/jwplayer-list-item';
import { JwpStatelessStreams } from './jwplayer-streams-stateless';

export interface JwpState extends VideoDepth {
	vastParams: VastParams;
	playlistItem: JWPlayerListItem;
	config: JWPlayerConfig;
	mute: boolean;
	adStatus: 'bootstrap' | 'preroll' | 'midroll' | 'postroll' | 'complete';
}

interface VideoDepth {
	depth: number;
	correlator: number;
}

export function createJwpStateStream(
	streams: JwpStatelessStreams,
	jwplayer: JWPlayer,
): Observable<JwpState> {
	const videoDepth$: Observable<VideoDepth> = streams.beforePlay$.pipe(
		scanCorrelatorDepth(),
		startWith({ depth: 0, correlator: 0 }),
	);
	const vastParams$: Observable<VastParams> = merge(
		streams.adRequest$,
		streams.adError$,
		streams.adImpression$,
	).pipe(
		createVastParams(),
		startWith(vastParser.parse(null)),
	);
	const videoStatus$ = merge(
		streams.beforePlay$.pipe(map(() => 'preroll')),
		streams.videoMidPoint$.pipe(map(() => 'midroll')),
		streams.beforeComplete$.pipe(map(() => 'postroll')),
	);
	const adStatus$: Observable<JwpState['adStatus']> = merge(
		streams.adStarted$.pipe(
			withLatestFrom(videoStatus$),
			map(([, videoStatus]) => videoStatus),
		),
		streams.complete$.pipe(map(() => 'complete')),
	).pipe(startWith('bootstrap')) as any;
	const common$ = merge(...Object.values(streams)).pipe(
		map(() => ({
			playlistItem:
				jwplayer.getPlaylistItem() ||
				({ sources: [], tracks: [], variations: [], images: [], allSources: [] } as any),
			config: jwplayer.getConfig(),
			mute: jwplayer.getMute(),
		})),
	);

	return combineLatest([videoDepth$, vastParams$, adStatus$, common$]).pipe(
		map(([videoDepth, vastParams, adStatus, common]) => ({
			...common,
			...videoDepth,
			vastParams,
			adStatus,
		})),
		shareReplay(1),
	);
}

function scanCorrelatorDepth<T>(): RxJsOperator<T, VideoDepth> {
	return (source: Observable<T>) =>
		source.pipe(
			scan(
				({ depth }) => ({
					correlator: Math.round(Math.random() * 10000000000),
					depth: depth + 1,
				}),
				{ correlator: 0, depth: 0 },
			),
		);
}

function createVastParams<T extends { payload: JWPlayerEvent }>(): RxJsOperator<T, VastParams> {
	return (source: Observable<T>) =>
		source.pipe(
			map((event) =>
				vastParser.parse(event.payload.tag, {
					imaAd: event.payload.ima && event.payload.ima.ad,
				}),
			),
		);
}
