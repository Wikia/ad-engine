import { AdSlot, context } from '@ad-engine/core';

import { JWPlayerHelper } from './jwplayer-helper';
import { JWPlayer } from '../external-types/jwplayer';
import { VideoTargeting } from '../jwplayer-actions';

export class JWPlayerHelperSkippingSecondVideo extends JWPlayerHelper {
	constructor(
		protected adSlot: AdSlot,
		protected jwplayer: JWPlayer,
		protected readonly targeting: VideoTargeting,
	) {
		super(adSlot, jwplayer, targeting);
	}

	protected shouldPlayAdOnNextVideo(videoPlaylistOrderNumber: number): boolean {
		const SPONSORED_VIDEO_INDEX = 2;

		return (
			context.get('options.video.playAdsOnNextVideo') &&
			videoPlaylistOrderNumber !== SPONSORED_VIDEO_INDEX
		);
	}
}
