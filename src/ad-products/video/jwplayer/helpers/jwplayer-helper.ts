import { AdSlot, context, vastDebugger, VastParams, utils } from '@ad-engine/core';
import { iasVideoTracker } from '../../porvata/plugins/ias/ias-video-tracker';
import { JWPlayer, JWPlayerEventParams } from '../external-types/jwplayer';
import { VideoTargeting } from '../jwplayer-actions';
import { JwpState } from '../streams/jwplayer-stream-state';

const EMPTY_VAST_CODE = 21009;

/**
 * Describes how things are done
 */
export class JWPlayerHelper {
	static LOG_GROUP_NAME = 'jwplayer-helper';

	constructor(
		protected adSlot: AdSlot,
		protected jwplayer: JWPlayer,
		protected readonly targeting: VideoTargeting,
	) {}

	private calledOnce = false;

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
			await iasVideoTracker.load();
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

		window.googleImaVansAdapter.init(google, adsManager, videoElement, iasConfig);
	}

	setSlotParams(vastParams: VastParams): void {
		this.adSlot.lineItemId = vastParams.lineItemId;
		this.adSlot.creativeId = vastParams.creativeId;
		this.adSlot.creativeSize = vastParams.size;
	}

	setSlotElementAttributes(status: 'success' | 'error', vastParams: VastParams): void {
		const attributes = vastDebugger.getVastAttributesFromVastParams(status, vastParams);
		const element = this.adSlot.element;

		Object.keys(attributes).forEach((key) => element.setAttribute(key, attributes[key]));
	}

	emitVideoAdError(adErrorCode: number): void {
		if (adErrorCode === EMPTY_VAST_CODE) {
			this.adSlot.setStatus(AdSlot.STATUS_COLLAPSE);
		} else {
			this.adSlot.setStatus(AdSlot.STATUS_ERROR);
		}

		this.adSlot.emit(AdSlot.VIDEO_AD_ERROR);
	}

	emitVideoAdRequest(): void {
		this.adSlot.emit(AdSlot.VIDEO_AD_REQUESTED);
	}

	emitVideoAdImpression(): void {
		this.adSlot.setStatus(AdSlot.STATUS_SUCCESS);
		this.adSlot.emit(AdSlot.VIDEO_AD_IMPRESSION);
	}

	updateVideoProperties(state: JwpState): void {
		this.adSlot.setConfigProperty('videoDepth', state.depth);
		this.adSlot.setConfigProperty('targeting.rv', state.rv);
	}

	shouldPlayPreroll(videoPlaylistOrderNumber: number, currentMediaId: string = null): boolean {
		return this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId);
	}

	shouldPlayMidroll(videoPlaylistOrderNumber: number, currentMediaId: string = null): boolean {
		return (
			context.get('options.video.isMidrollEnabled') &&
			this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId)
		);
	}

	shouldPlayPostroll(videoPlaylistOrderNumber: number, currentMediaId: string = null): boolean {
		return (
			context.get('options.video.isPostrollEnabled') &&
			this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId)
		);
	}

	protected canAdBePlayed(
		videoPlaylistOrderNumber: number,
		currentMediaId: string = null,
	): boolean {
		const isReplay = videoPlaylistOrderNumber > 1;

		return (
			this.adSlot.isEnabled() &&
			(!isReplay ||
				(isReplay && this.shouldPlayAdOnNextVideo(videoPlaylistOrderNumber, currentMediaId)))
		);
	}

	protected shouldPlayAdOnNextVideo(
		videoPlaylistOrderNumber: number,
		currentMediaId: string = null,
	): boolean {
		const capping = context.get('options.video.adsOnNextVideoFrequency');
		utils.logger(JWPlayerHelper.LOG_GROUP_NAME, videoPlaylistOrderNumber, currentMediaId);

		return (
			context.get('options.video.playAdsOnNextVideo') &&
			capping > 0 &&
			(videoPlaylistOrderNumber - 1) % capping === 0
		);
	}

	playVideoAd(position: 'midroll' | 'postroll' | 'preroll', state: JwpState): void {
		this.adSlot.setConfigProperty('audio', !state.mute);

		const vastUrl = this.getVastUrl(position, state);

		if (context.get('options.video.pauseJWPlayerAd')) {
			const pauseVideoAdOnTabSwitch = () => {
				this.jwplayer.pauseAd(document.visibilityState !== 'visible');
			};

			document.addEventListener('visibilitychange', pauseVideoAdOnTabSwitch, false);
		}

		this.jwplayer.playAd(vastUrl);
	}

	private getVastUrl(position: string, state: JwpState): string {
		if (!this.calledOnce) {
			this.calledOnce = true;
		} else {
			state.rv++;
			this.updateVideoProperties(state);
		}

		return utils.buildVastUrl(16 / 9, this.adSlot.getSlotName(), {
			correlator: state.correlator,
			vpos: position,
			targeting: {
				rv: this.getRvKeyVal(state.rv),
				v1: state.playlistItem.mediaid || '',
				...this.targeting,
			},
		});
	}

	private getRvKeyVal(rv: number): string | string[] {
		return rv === 1 ? '1' : [rv.toString(), '2+'];
	}
}
