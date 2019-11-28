import {
	AdSlot,
	buildVastUrl,
	context,
	events,
	eventService,
	utils,
	vastDebugger,
	VastParams,
} from '@ad-engine/core';
import { merge, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { JWPlayerTracker } from '../../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../../jwplayer-ads-factory';
import { JWPlayer, JWPlayerEventParams } from '../jwplayer-plugin/jwplayer';
import { createJWPlayerStreams, JWPlayerStreams } from '../jwplayer-streams';
import {
	EMPTY_VAST_CODE,
	shouldPlayMidroll,
	shouldPlayPostroll,
	shouldPlayPreroll,
} from '../jwplayer-utils';

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

		return merge(
			this.adError(streams.adError$),
			this.adRequest(streams.adRequest$),
			this.adImpression(streams.adImpression$),
			this.complete(streams.complete$),
			this.adBlock(streams.adBlock$),
			this.beforePlay(streams.beforePlay$),
			this.videoMidPoint(streams.videoMidPoint$),
			this.beforeComplete(streams.beforeComplete$),
		);
	}

	private adError(stream$: JWPlayerStreams['adError$']): Observable<any> {
		return stream$.pipe(
			tap(({ event, vastParams }) => {
				log(`ad error message: ${event.message}`);
				this.setAdSlotParams(vastParams);
				this.setAdSlotElementAttributes(vastParams);

				if (event.adErrorCode === EMPTY_VAST_CODE) {
					this.adSlot.setStatus(AdSlot.STATUS_COLLAPSE);
				} else {
					this.adSlot.setStatus(AdSlot.STATUS_ERROR);
				}

				eventService.emit(events.VIDEO_AD_ERROR, this.adSlot);
			}),
		);
	}

	private adRequest(stream$: JWPlayerStreams['adRequest$']): Observable<any> {
		return stream$.pipe(
			tap(({ vastParams }) => {
				this.setAdSlotElementAttributes(vastParams);
				eventService.emit(events.VIDEO_AD_REQUESTED, this.adSlot);
			}),
		);
	}

	private adImpression(stream$: JWPlayerStreams['adImpression$']): Observable<any> {
		return stream$.pipe(
			tap(({ vastParams }) => {
				this.setAdSlotParams(vastParams);
				this.adSlot.setStatus(AdSlot.STATUS_SUCCESS);
				eventService.emit(events.VIDEO_AD_IMPRESSION, this.adSlot);
			}),
			filter(() => this.isMoatTrackingEnabled()),
			tap(({ event }) => this.trackMoat(event)),
		);
	}

	private complete(stream$: JWPlayerStreams['complete$']): Observable<any> {
		return stream$.pipe(tap(() => this.resetTrackerAdProduct()));
	}

	private adBlock(stream$: JWPlayerStreams['adBlock$']): Observable<any> {
		return stream$.pipe(tap(() => this.resetTrackerAdProduct()));
	}

	private beforePlay(stream$: JWPlayerStreams['beforePlay$']): Observable<any> {
		return stream$.pipe(
			tap(({ depth }) => {
				const { mediaid } = this.jwplayer.getPlaylistItem() || {};

				this.slotTargeting.v1 = mediaid;
				this.tracker.updateVideoId();
				this.adSlot.setConfigProperty('videoDepth', depth);
			}),
			filter(({ depth }) => shouldPlayPreroll(depth)),
			tap(({ depth, correlator }) => this.playVideoAd('preroll', depth, correlator)),
		);
	}

	private videoMidPoint(stream$: JWPlayerStreams['videoMidPoint$']): Observable<any> {
		return stream$.pipe(
			filter(({ depth }) => shouldPlayMidroll(depth)),
			tap(({ depth, correlator }) => this.playVideoAd('midroll', depth, correlator)),
		);
	}

	private beforeComplete(stream$: JWPlayerStreams['beforeComplete$']): Observable<any> {
		return stream$.pipe(
			filter(({ depth }) => shouldPlayPostroll(depth)),
			tap(({ depth, correlator }) => this.playVideoAd('postroll', depth, correlator)),
		);
	}

	// #################

	private isMoatTrackingEnabled(): boolean {
		return context.get('options.video.moatTracking.enabledForArticleVideos') && !!window.moatjw;
	}

	private trackMoat(event: JWPlayerEventParams['adImpression']): void {
		const partnerCode =
			context.get('options.video.moatTracking.articleVideosPartnerCode') ||
			context.get('options.video.moatTracking.partnerCode');

		window.moatjw.add({
			partnerCode,
			player: this.jwplayer,
			adImpressionEvent: event,
		});
	}

	private resetTrackerAdProduct(): void {
		this.tracker.adProduct = this.adSlot.config.slotName;
	}

	private setAdSlotParams(vastParams: VastParams): void {
		this.adSlot.lineItemId = vastParams.lineItemId;
		this.adSlot.creativeId = vastParams.creativeId;
		this.adSlot.creativeSize = vastParams.size;
	}

	private setAdSlotElementAttributes(vastParams: VastParams): void {
		const attributes = vastDebugger.getVastAttributesFromVastParams('success', vastParams);
		const element = this.adSlot.element;

		Object.keys(attributes)
			.map((key) => ({ key, value: attributes[key] }))
			.forEach(({ key, value }) => element.setAttribute(key, value));
	}

	private playVideoAd(
		position: 'midroll' | 'postroll' | 'preroll',
		depth: number,
		correlator: number,
	): void {
		this.tracker.adProduct = `${this.adSlot.config.trackingKey}-${position}`;
		this.adSlot.setConfigProperty('audio', !this.jwplayer.getMute());

		const vastUrl = this.getVastUrl(position, depth, correlator);

		this.jwplayer.playAd(vastUrl);
	}

	private getVastUrl(position: string, depth: number, correlator: number): string {
		return buildVastUrl(16 / 9, this.adSlot.getSlotName(), {
			correlator,
			vpos: position,
			targeting: {
				passback: 'jwplayer',
				rv: this.calculateRV(depth),
				...this.slotTargeting,
			},
		});
	}

	private calculateRV(depth: number): number {
		const capping = context.get('options.video.adsOnNextVideoFrequency');

		return depth < 2 || !capping ? 1 : Math.floor((depth - 1) / capping) + 1;
	}
}
