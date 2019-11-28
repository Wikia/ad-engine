import { context, VastParams, vastParser } from '@ad-engine/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JWPlayerEvent } from './jwplayer-plugin/jwplayer-event';

export const EMPTY_VAST_CODE = 21009;

export function supplementVastParams<T extends JWPlayerEvent>(): (
	source: Observable<T>,
) => Observable<{ event: T; vastParams: VastParams }> {
	return (source) =>
		source.pipe(
			map((event) => ({
				event,
				vastParams: vastParser.parse(event.tag, {
					imaAd: event.ima && event.ima.ad,
				}),
			})),
		);
}

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
