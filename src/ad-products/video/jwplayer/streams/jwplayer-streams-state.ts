import { RxJsOperator, VastParams, vastParser } from '@ad-engine/core';
import { combineLatest, merge, Observable } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';
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

	// TODO: every event should trigger common stuff update
	return combineLatest([videoDepth$, vastParams$]).pipe(
		map(([videoDepth, vastParams]) => ({
			...videoDepth,
			vastParams,
			playlistItem: jwplayer.getPlaylistItem(),
			config: jwplayer.getConfig(),
			mute: jwplayer.getMute(),
		})),
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
