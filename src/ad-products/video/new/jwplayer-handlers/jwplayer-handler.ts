import { AdSlot, events, eventService, setAttributes, utils, vastDebugger } from '@ad-engine/core';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { JWPlayerTracker } from '../../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../../jwplayer-ads-factory';
import { JWPlayer, JWPlayerEventParams } from '../jwplayer-plugin/jwplayer';
import { createJWPlayerStreams } from '../jwplayer-streams';
import { EMPTY_VAST_CODE, supplementVastParams, updateSlotParams } from '../jwplayer-utils';

const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

export class JWPlayerHandler {
	constructor(
		private adSlot: AdSlot,
		private tracker: JWPlayerTracker,
		private slotTargeting: VideoTargeting,
		private jwplayer: JWPlayer,
	) {}

	run(): Observable<any> {
		const streams = createJWPlayerStreams(this.jwplayer);

		return merge(this.onAdError(streams.adError$), this.onAdRequest(streams.adRequest$));
	}

	private onAdError(stream$: Observable<JWPlayerEventParams['adError']>): Observable<any> {
		return stream$.pipe(
			distinctUntilChanged((a, b) => a.adPlayId === b.adPlayId),
			supplementVastParams(),
			tap(({ event, vastParams }) => {
				log(`ad error message: ${event.message}`);
				updateSlotParams(this.adSlot, vastParams);
				setAttributes(
					this.adSlot.element,
					vastDebugger.getVastAttributesFromVastParams('error', vastParams),
				);

				if (event.adErrorCode === EMPTY_VAST_CODE) {
					this.adSlot.setStatus(AdSlot.STATUS_COLLAPSE);
				} else {
					this.adSlot.setStatus(AdSlot.STATUS_ERROR);
				}

				eventService.emit(events.VIDEO_AD_ERROR, this.adSlot);
			}),
		);
	}

	private onAdRequest(stream$: Observable<JWPlayerEventParams['adRequest']>): Observable<any> {
		return stream$.pipe(
			supplementVastParams(),
			tap(({ vastParams }) => {
				setAttributes(
					this.adSlot.element,
					vastDebugger.getVastAttributesFromVastParams('success', vastParams),
				);
				eventService.emit(events.VIDEO_AD_REQUESTED, this.adSlot);
			}),
		);
	}
}
