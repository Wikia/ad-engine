import { RxJsOperator, VastParams, vastParser } from '@ad-engine/core';
import { combineLatest, merge, Observable } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';
import { JWPlayerEvent } from '../external-types/jwplayer-event';
import { JwpStatelessStreams } from './jwplayer-streams-stateless';

export interface JwpState extends VideoDepth {
	vastParams: VastParams;
}

interface VideoDepth {
	depth: number;
	correlator: number;
}

export function createJwpStateStream(streams: JwpStatelessStreams): Observable<JwpState> {
	const videoDepth$: Observable<VideoDepth> = streams.beforePlay$.pipe(
		startWith(0),
		scanCorrelatorDepth(),
	);
	const vastParams$: Observable<VastParams> = merge(
		streams.adRequest$,
		streams.adError$,
		streams.adImpression$,
	).pipe(
		createVastParams(),
		startWith(vastParser.parse(null)),
	);

	return combineLatest([videoDepth$, vastParams$]).pipe(
		map(([videoDepth, vastParams]) => ({ vastParams, ...videoDepth })),
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

function createVastParams<T extends { event: JWPlayerEvent }>(): RxJsOperator<T, VastParams> {
	return (source: Observable<T>) =>
		source.pipe(
			map((value) =>
				vastParser.parse(value.event.tag, {
					imaAd: value.event.ima && value.event.ima.ad,
				}),
			),
		);
}
