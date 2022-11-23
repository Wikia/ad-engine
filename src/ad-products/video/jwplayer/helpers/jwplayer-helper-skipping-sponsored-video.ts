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
			window.sponsoredVideos,
		);

		const forcedVideoId = utils.queryString.get('force_sponsored_video');
		if (forcedVideoId) {
			window.sponsoredVideos = [forcedVideoId];
			this.log('Overwritting window.sponsoredVideo!', window.sponsoredVideos);
		}

		if (!Array.isArray(window.sponsoredVideos)) {
			externalLogger.log('JWPlayer - no window.sponsoredVideos', {
				currentMediaId,
				videoPlaysCounter: videoPlaysCounter,
			});

			return false;
		}

		return (
			context.get('options.video.playAdsOnNextVideo') &&
			window.sponsoredVideos.indexOf(currentMediaId) === -1
		);
	}

	public ensureSponsoredVideosList(): void {
		if (Array.isArray(window.sponsoredVideos)) {
			this.log('Sponsored videos list exists and seems correct', window.sponsoredVideos);

			return;
		}

		this.log(
			'Incorrect window.sponsoredVideos, using fallback to Pandora!',
			window.sponsoredVideos,
		);
		const url = utils.getServicesBaseURL() + 'article-video/jw-platform-api/get-sponsored-videos';

		utils.scriptLoader
			.loadAsset(url)
			.then((response) => {
				if (Array.isArray(response)) {
					window.sponsoredVideos = response;
					this.log('Sponsored videos list updated!', window.sponsoredVideos);
				} else {
					this.log('Incorrect sponsored videos list from Pandora!', response);
				}
			})
			.catch((error) => {
				this.log('Incorrect request status from Pandora!', error);
			});
	}

	private log(message: string, additionalData: any) {
		utils.logger(JWPlayerHelper.LOG_GROUP_NAME, message, additionalData);
	}
}
