import { AdSlot, events, eventService, utils, vastParser } from '@ad-engine/core';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../jwplayer-ads-factory';
import { createJWPlayerStreams } from './jwplayer-actions';
import { JWPlayer, JWPlayerEventParams } from './jwplayer-plugin/jwplayer';

const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

export class JWPlayerAd {
	constructor(
		private adSlot: AdSlot,
		private tracker: JWPlayerTracker,
		private slotTargeting: VideoTargeting,
		private jwplayer: JWPlayer,
	) {}

	run(): Observable<any> {
		const streams = createJWPlayerStreams(this.jwplayer);
		return merge(this.onAdError(streams.adError$));
	}

	private onAdError(stream$: Observable<JWPlayerEventParams['adError']>): Observable<any> {
		return stream$.pipe(
			distinctUntilChanged((a, b) => a.adPlayId === b.adPlayId),
			map((event) => ({
				event,
				vastParams: vastParser.parse(event.tag, {
					imaAd: event.ima && event.ima.ad,
				}),
			})),
			tap(({ event }) => log(`ad error message: ${event.message}`)),
			tap(() => eventService.emit(events.VIDEO_AD_ERROR, this.adSlot)),
		);
	}
}
