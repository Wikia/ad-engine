import { AdSlot, events, eventService, utils, vastParser } from '@ad-engine/core';
import { Communicator } from '@wikia/post-quecast';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, tap, withLatestFrom } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../jwplayer-ads-factory';
import { jwpAdError, jwpAdRequest } from './jwplayer-actions';

const log = (...args) => utils.logger('jwplayer-ads-factory', ...args);

export class JWPlayerAd {
	constructor(
		private adSlot: AdSlot,
		private tracker: JWPlayerTracker,
		private slotTargeting: VideoTargeting,
		private communicator: Communicator,
	) {}

	run(): Observable<any> {
		return merge(this.onAdError());
	}

	private onAdError() {
		return this.communicator.actions$.pipe(
			ofType(jwpAdError),
			distinctUntilChanged((a, b) => a.event.adPlayId === b.event.adPlayId),
			this.ensureEventTag(),
			map(({ event }) => ({
				event,
				vastParams: vastParser.parse(event.tag, {
					imaAd: event.ima && event.ima.ad,
				}),
			})),
			tap(({ event }) => log(`ad error message: ${event.message}`)),
			tap(() => this.emitError()),
		);
	}

	private ensureEventTag<T extends { event: { tag?: string } }>(): (
		source: Observable<T>,
	) => Observable<T> {
		const base$ = merge(
			of({ event: { tag: null } }),
			this.communicator.actions$.pipe(ofType(jwpAdRequest)),
		);

		return (source: Observable<T>) =>
			source.pipe(
				withLatestFrom(base$),
				map(([adError, adRequest]) => ({
					...adError,
					event: { ...adError.event, tag: adError.event.tag || adRequest.event.tag },
				})),
			);
	}

	private emitImpression(): void {
		eventService.emit(events.VIDEO_AD_IMPRESSION, this.adSlot);
	}

	private emitError(): void {
		eventService.emit(events.VIDEO_AD_ERROR, this.adSlot);
	}

	private emitAdRequested(): void {
		eventService.emit(events.VIDEO_AD_REQUESTED, this.adSlot);
	}
}
