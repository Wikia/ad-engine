import { AdSlot, VastParams, vastParser } from '@ad-engine/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JWPlayerEvent } from './jwplayer-plugin/jwplayer-event';

export const EMPTY_VAST_CODE = 21009;

export function updateSlotParams(adSlot: AdSlot, vastParams: VastParams): void {
	adSlot.lineItemId = vastParams.lineItemId;
	adSlot.creativeId = vastParams.creativeId;
	adSlot.creativeSize = vastParams.size;
}

// export function playVideoAd(
// 	position: 'midroll' | 'postroll' | 'preroll',
// 	adSlot: AdSlot,
// 	tracker: JWPlayerTracker,
// 	slotTargeting: VideoTargeting,
// 	jwplayer: JWPlayer,
// ) {
// 	tracker.adProduct = `${adSlot.config.trackingKey}-${position}`;
// 	adSlot.setConfigProperty('audio', !jwplayer.getMute());
//
// 	const vastUrl = getVastUrl(adSlot, position, depth, correlator, slotTargeting);
//
// 	setCurrentVast(position, vastUrl);
// 	jwplayer.playAd(vastUrl);
// }

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
