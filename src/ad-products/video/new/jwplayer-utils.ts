import { context } from '@ad-engine/core';

export const EMPTY_VAST_CODE = 21009;

export function shouldPlayAdOnNextVideo(depth: number): boolean {
	const capping = context.get('options.video.adsOnNextVideoFrequency');

	return (
		context.get('options.video.playAdsOnNextVideo') && capping > 0 && (depth - 1) % capping === 0
	);
}

export function canAdBePlayed(depth: number): boolean {
	const isReplay = depth > 1;

	return !isReplay || (isReplay && shouldPlayAdOnNextVideo(depth));
}

export function shouldPlayPreroll(videoDepth: number): boolean {
	return canAdBePlayed(videoDepth);
}

export function shouldPlayMidroll(videoDepth: number): boolean {
	return context.get('options.video.isMidrollEnabled') && canAdBePlayed(videoDepth);
}

export function shouldPlayPostroll(videoDepth: number): boolean {
	return context.get('options.video.isPostrollEnabled') && canAdBePlayed(videoDepth);
}
