import {
	AdSlot,
	events,
	eventService,
	setAttributes,
	utils,
	vastDebugger,
	vastParser,
} from '@ad-engine/core';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../jwplayer-ads-factory';
import { createJWPlayerStreams } from './jwplayer-actions';
import { JWPlayer, JWPlayerEventParams } from './jwplayer-plugin/jwplayer';
import { EMPTY_VAST_CODE, updateSlotParams } from './jwplayer-utils';

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
			tap(({ vastParams }) => updateSlotParams(this.adSlot, vastParams)),
			tap(({ vastParams }) =>
				setAttributes(
					this.adSlot.element,
					vastDebugger.getVastAttributesFromVastParams('error', vastParams),
				),
			),
			tap(({ event }) => {
				if (event.adErrorCode === EMPTY_VAST_CODE) {
					this.adSlot.setStatus(AdSlot.STATUS_COLLAPSE);
				} else {
					this.adSlot.setStatus(AdSlot.STATUS_ERROR);
				}
			}),
			tap(() => eventService.emit(events.VIDEO_AD_ERROR, this.adSlot)),
		);
	}
}
