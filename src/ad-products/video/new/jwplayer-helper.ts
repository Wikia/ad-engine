import { AdSlot, buildVastUrl, context, vastDebugger, VastParams } from '@ad-engine/core';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../jwplayer-ads-factory';
import { JWPlayer, JWPlayerEventParams } from './jwplayer-plugin/jwplayer';

/**
 * Describes how things are done
 */
export class JWPlayerHelper {
	constructor(
		private adSlot: AdSlot,
		private tracker: JWPlayerTracker,
		private slotTargeting: VideoTargeting,
		private jwplayer: JWPlayer,
	) {}

	isMoatTrackingEnabled(): boolean {
		return context.get('options.video.moatTracking.enabledForArticleVideos') && !!window.moatjw;
	}

	trackMoat(event: JWPlayerEventParams['adImpression']): void {
		const partnerCode =
			context.get('options.video.moatTracking.articleVideosPartnerCode') ||
			context.get('options.video.moatTracking.partnerCode');

		window.moatjw.add({
			partnerCode,
			player: this.jwplayer,
			adImpressionEvent: event,
		});
	}

	resetTrackerAdProduct(): void {
		this.tracker.adProduct = this.adSlot.config.slotName;
	}

	setAdSlotParams(vastParams: VastParams): void {
		this.adSlot.lineItemId = vastParams.lineItemId;
		this.adSlot.creativeId = vastParams.creativeId;
		this.adSlot.creativeSize = vastParams.size;
	}

	setAdSlotElementAttributes(vastParams: VastParams): void {
		const attributes = vastDebugger.getVastAttributesFromVastParams('success', vastParams);
		const element = this.adSlot.element;

		Object.keys(attributes)
			.map((key) => ({ key, value: attributes[key] }))
			.forEach(({ key, value }) => element.setAttribute(key, value));
	}

	updateVideoId(): void {
		const { mediaid } = this.jwplayer.getPlaylistItem() || {};

		this.slotTargeting.v1 = mediaid;
		this.tracker.updateVideoId();
	}

	playVideoAd(
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
