import { AdSlot } from '@ad-engine/core';
import { Communicator } from '@wikia/post-quecast';
import { merge, Observable } from 'rxjs';
import { ofType } from 'ts-action-operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { VideoTargeting } from '../jwplayer-ads-factory';
import { jwpAdError } from './jwplayer-actions';

export class JWPlayerAd {
	constructor(
		private adSlot: AdSlot,
		private tracker: JWPlayerTracker,
		private slotTargeting: VideoTargeting,
		private communicator: Communicator,
	) {}

	run(): Observable<any> {
		return merge(this.onAdError());
	}

	private onAdError(): Observable<any> {
		return this.communicator.actions$.pipe(ofType(jwpAdError));
	}
}
