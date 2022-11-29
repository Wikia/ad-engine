import { AdSlot, context, externalLogger, utils } from '@ad-engine/core';

import { JWPlayerHelper } from './jwplayer-helper';
import { JWPlayer } from '../external-types/jwplayer';
import { VideoTargeting } from '../jwplayer-actions';

export class JwplayerHelperSkippingSponsoredVideo extends JWPlayerHelper {
	constructor(
		protected adSlot: AdSlot,
		protected jwplayer: JWPlayer,
		protected readonly targeting: VideoTargeting,
		private sponsoredVideos = window.sponsoredVideos,
	) {
		super(adSlot, jwplayer, targeting);
	}

	shouldPlayPreroll(videoPlaysCounter: number, currentMediaId: string): boolean {
		return this.canAdBePlayed(videoPlaysCounter, currentMediaId);
	}

	shouldPlayMidroll(videoPlaysCounter: number, currentMediaId: string): boolean {
		return (
			context.get('options.video.isMidrollEnabled') &&
			this.canAdBePlayed(videoPlaysCounter, currentMediaId)
		);
	}

	shouldPlayPostroll(videoPlaysCounter: number, currentMediaId: string): boolean {
		return (
			context.get('options.video.isPostrollEnabled') &&
			this.canAdBePlayed(videoPlaysCounter, currentMediaId)
		);
	}

	protected canAdBePlayed(videoPlaysCounter: number, currentMediaId: string): boolean {
		return (
			this.adSlot.isEnabled() && this.shouldPlayAdOnNextVideo(videoPlaysCounter, currentMediaId)
		);
	}

	protected shouldPlayAdOnNextVideo(videoPlaysCounter: number, currentMediaId: string): boolean {
		utils.logger(
			JWPlayerHelper.LOG_GROUP_NAME,
			videoPlaysCounter,
			currentMediaId,
			this.sponsoredVideos,
		);

		const forcedVideoId = utils.queryString.get('force_sponsored_video');
		if (forcedVideoId) {
			this.sponsoredVideos = [forcedVideoId];
			this.log('Overwritting window.sponsoredVideo!', this.sponsoredVideos);
		}

		if (!Array.isArray(this.sponsoredVideos)) {
			this.log(
				'Incorrect window.sponsoredVideos, using fallback to Pandora!',
				this.sponsoredVideos,
			);

			const url = utils.getServicesBaseURL() + 'article-video/jw-platform-api/get-sponsored-videos';
			this.sponsoredVideos = JSON.parse(<string>utils.scriptLoader.loadSync(url));
		}

		if (!this.sponsoredVideos) {
			externalLogger.log('JWPlayer - no sponsored videos', {
				currentMediaId,
				videoPlaysCounter: videoPlaysCounter,
			});

			return false;
		}

		return (
			context.get('options.video.playAdsOnNextVideo') &&
			this.sponsoredVideos.indexOf(currentMediaId) === -1
		);
	}

	private log(message: string, additionalData: any) {
		utils.logger(JWPlayerHelper.LOG_GROUP_NAME, message, additionalData);
	}
}
