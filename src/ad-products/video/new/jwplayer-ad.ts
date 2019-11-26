import { AdSlot } from '@ad-engine/core';
import { Observable } from 'rxjs';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../jwplayer-ads-factory';

export class JWPlayerAd {
	constructor(
		private adSlot: AdSlot,
		private tracker: JWPlayerTracker,
		private slotTargeting: VideoTargeting,
	) {}

	run(): Observable<any> {}
}
