import { AdSlot, buildVastUrl, context, events, vastDebugger, VastParams } from '@ad-engine/core';
import { iasVideoTracker } from '../../player/porvata/ias/ias-video-tracker';
import { JWPlayer, JWPlayerEventParams } from '../external-types/jwplayer';
import { VideoTargeting } from '../jwplayer-actions';
import { JwpState } from '../streams/jwplayer-stream-state';

const EMPTY_VAST_CODE = 21009;

/**
 * Describes how things are done
 */
export class JWPlayerHelper {
	constructor(
		private adSlot: AdSlot,
		private jwplayer: JWPlayer,
		private readonly targeting: VideoTargeting,
	) {}

	isMoatTrackingEnabled(): boolean {
		return context.get('options.video.moatTracking.enabledForArticleVideos') && !!window.moatjw;
	}

	trackMoat(payload: JWPlayerEventParams['adImpression']): void {
		const partnerCode =
			context.get('options.video.moatTracking.articleVideosPartnerCode') ||
			context.get('options.video.moatTracking.partnerCode');

		window.moatjw.add({
			partnerCode,
			player: this.jwplayer,
			adImpressionEvent: payload,
		});
	}

	async awaitIasTracking<T>(payload: T): Promise<T> {
		if (!this.isIasTrackingEnabled()) {
			return payload;
		}

		try {
			await iasVideoTracker.loadScript();
		} catch (e) {
			console.error(e);
		}

		return payload;
	}

	isIasTrackingEnabled(): boolean {
		return context.get('options.video.iasTracking.enabled');
	}

	initIasVideoTracking({ adsManager, videoElement }: JWPlayerEventParams['adsManager']): void {
		const iasConfig = context.get('options.video.iasTracking.config');

		iasVideoTracker.init(window.google, adsManager, videoElement, iasConfig);
	}

	setSlotParams(vastParams: VastParams): void {
		this.adSlot.lineItemId = vastParams.lineItemId;
		this.adSlot.creativeId = vastParams.creativeId;
		this.adSlot.creativeSize = vastParams.size;
	}

	setSlotElementAttributes(vastParams: VastParams): void {
		const attributes = vastDebugger.getVastAttributesFromVastParams('success', vastParams);
		const element = this.adSlot.element;

		Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));
	}

	emitVideoAdError(adErrorCode: number): void {
		if (adErrorCode === EMPTY_VAST_CODE) {
			this.adSlot.setStatus(AdSlot.STATUS_COLLAPSE);
		} else {
			this.adSlot.setStatus(AdSlot.STATUS_ERROR);
		}

		this.adSlot.emit(events.VIDEO_AD_ERROR);
	}

	emitVideoAdRequest(): void {
		this.adSlot.emit(events.VIDEO_AD_REQUESTED);
	}

	emitVideoAdImpression(): void {
		this.adSlot.setStatus(AdSlot.STATUS_SUCCESS);
		this.adSlot.emit(events.VIDEO_AD_IMPRESSION);
	}

	updateVideoDepth(depth: number): void {
		this.adSlot.setConfigProperty('videoDepth', depth);
	}

	shouldPlayPreroll(videoDepth: number): boolean {
		return this.canAdBePlayed(videoDepth);
	}

	shouldPlayMidroll(videoDepth: number): boolean {
		return context.get('options.video.isMidrollEnabled') && this.canAdBePlayed(videoDepth);
	}

	shouldPlayPostroll(videoDepth: number): boolean {
		return context.get('options.video.isPostrollEnabled') && this.canAdBePlayed(videoDepth);
	}

	private canAdBePlayed(depth: number): boolean {
		const isReplay = depth > 1;

		return !isReplay || (isReplay && this.shouldPlayAdOnNextVideo(depth));
	}

	private shouldPlayAdOnNextVideo(depth: number): boolean {
		const capping = context.get('options.video.adsOnNextVideoFrequency');

		return (
			context.get('options.video.playAdsOnNextVideo') && capping > 0 && (depth - 1) % capping === 0
		);
	}

	playVideoAd(position: 'midroll' | 'postroll' | 'preroll', state: JwpState): void {
		this.adSlot.setConfigProperty('audio', !state.mute);

		const vastUrl = this.getVastUrl(position, state);

		this.jwplayer.playAd(vastUrl);
	}

	private getVastUrl(position: string, state: JwpState): string {
		return buildVastUrl(16 / 9, this.adSlot.getSlotName(), {
			correlator: state.correlator,
			vpos: position,
			targeting: {
				passback: 'jwplayer',
				rv: this.calculateRV(state.depth),
				v1: state.playlistItem.mediaid || '',
				...this.targeting,
			},
		});
	}

	private calculateRV(depth: number): number {
		const capping = context.get('options.video.adsOnNextVideoFrequency');

		return depth < 2 || !capping ? 1 : Math.floor((depth - 1) / capping) + 1;
	}
}
