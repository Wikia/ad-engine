import { AdSlot } from '@ad-engine/core';
import { Communicator, ofType } from '@wikia/post-quecast';
import { Observable } from 'rxjs';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../jwplayer-ads-factory';

export class JWPlayerAd {
	constructor(
		private adSlot: AdSlot,
		private tracker: JWPlayerTracker,
		private slotTargeting: VideoTargeting,
		private communicator: Communicator,
	) {}

	run(): Observable<any> {}

	private onAdError() {
		this.communicator.actions$.pipe(ofType('[JWPlayer Internal] adError'));
	}
}
