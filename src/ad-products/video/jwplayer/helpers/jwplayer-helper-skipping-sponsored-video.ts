import { AdSlot, context } from '@ad-engine/core';

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

	// @ts-ignore we want to extend the method
	shouldPlayPreroll(videoPlaylistOrderNumber: number, currentMediaId: string): boolean {
		return this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId);
	}

	// @ts-ignore we want to extend the method
	shouldPlayMidroll(videoPlaylistOrderNumber: number, currentMediaId: string): boolean {
		return (
			context.get('options.video.isMidrollEnabled') &&
			this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId)
		);
	}

	// @ts-ignore we want to extend the method
	shouldPlayPostroll(videoPlaylistOrderNumber: number, currentMediaId: string): boolean {
		return (
			context.get('options.video.isPostrollEnabled') &&
			this.canAdBePlayed(videoPlaylistOrderNumber, currentMediaId)
		);
	}

	// @ts-ignore we want to extend the method
	protected canAdBePlayed(videoPlaylistOrderNumber: number, currentMediaId: string): boolean {
		const isReplay = videoPlaylistOrderNumber > 1;

		return (
			this.adSlot.isEnabled() &&
			(!isReplay ||
				(isReplay && this.shouldPlayAdOnNextVideo(videoPlaylistOrderNumber, currentMediaId)))
		);
	}

	// @ts-ignore we want to extend the method
	protected shouldPlayAdOnNextVideo(
		videoPlaylistOrderNumber: number,
		currentMediaId: string,
	): boolean {
		const sponsoredVideos = context.get('options.video.sponsoredVideos');

		return (
			context.get('options.video.playAdsOnNextVideo') &&
			sponsoredVideos.indexOf(currentMediaId) === -1
		);
	}
}
