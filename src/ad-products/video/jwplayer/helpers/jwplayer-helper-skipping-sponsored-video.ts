import { AdSlot, context, externalLogger, utils } from '@ad-engine/core';

import { JWPlayerHelper } from './jwplayer-helper';
import { JWPlayer } from '../external-types/jwplayer';
import { VideoTargeting } from '../jwplayer-actions';

export class JwplayerHelperSkippingSponsoredVideo extends JWPlayerHelper {
	constructor(
		protected adSlot: AdSlot,
		protected jwplayer: JWPlayer,
		protected readonly targeting: VideoTargeting,
	) {
		super(adSlot, jwplayer, targeting);
	}

	shouldPlayPreroll(videoPlaylistOrderNumber: number, currentMediaId: string): boolean {
		return this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId);
	}

	shouldPlayMidroll(videoPlaylistOrderNumber: number, currentMediaId: string): boolean {
		return (
			context.get('options.video.isMidrollEnabled') &&
			this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId)
		);
	}

	shouldPlayPostroll(videoPlaylistOrderNumber: number, currentMediaId: string): boolean {
		return (
			context.get('options.video.isPostrollEnabled') &&
			this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId)
		);
	}

	protected canAdBePlayed(videoPlaylistOrderNumber: number, currentMediaId: string): boolean {
		return (
			this.adSlot.isEnabled() &&
			this.shouldPlayAdOnNextVideo(videoPlaylistOrderNumber, currentMediaId)
		);
	}

	protected shouldPlayAdOnNextVideo(
		videoPlaylistOrderNumber: number,
		currentMediaId: string,
	): boolean {
		utils.logger(
			JWPlayerHelper.LOG_GROUP_NAME,
			videoPlaylistOrderNumber,
			currentMediaId,
			window.sponsoredVideos,
		);

		if (!Array.isArray(window.sponsoredVideos)) {
			externalLogger.log('JWPlayer - no window.sponsoredVideos', {
				currentMediaId,
				videoPlaylistOrderNumber,
			});

			return false;
		}

		return (
			context.get('options.video.playAdsOnNextVideo') &&
			window.sponsoredVideos.indexOf(currentMediaId) === -1
		);
	}
}
