import { AdSlot, slotService } from '@ad-engine/core';
import { Communicator, ofType } from '@wikia/post-quecast';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { JwPlayerAdsFactoryOptions, loadMoatPlugin } from '../jwplayer-ads-factory';
import { SetupJWPlayerAction } from './jwplayer-actions';

export class JWPlayerAdsManager {
	private communicator = new Communicator();
	private adSlot: AdSlot;
	// @ts-ignore
	private tracker: JWPlayerTracker;

	run() {
		this.onSetupPlayer().subscribe();
	}

	private onSetupPlayer(): Observable<any> {
		return this.communicator.actions$.pipe(
			ofType('[JWPlayer] setup player'),
			take(1),
			map((action: SetupJWPlayerAction) => action.payload),
			tap((options: JwPlayerAdsFactoryOptions) => {
				const slotName = options.slotName || (options.featured ? 'featured' : 'video');

				this.adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });

				if (!slotService.get(slotName)) {
					slotService.add(this.adSlot);
				}

				loadMoatPlugin();

				this.tracker = new JWPlayerTracker({
					slotName,
					adProduct: this.adSlot.config.trackingKey,
					audio: options.audio,
					ctp: !options.autoplay,
					videoId: options.videoId,
				});
			}),
		);
	}

	onPlayerReady(): Observable<any> {
		return this.communicator.actions$;
	}

	// on
	// // adImpression,
	// // adsManager,
	// // adBlock,
	// // beforePlay,
	// // videoMidPoint,
	// // beforeComplete,
	// // complete,
	// // adRequest
	// // adImpression,
	// // adError
	// getMute
	// getConfig -> autostart
	// getPlaylistItem
	// playAd()

	// events
	// adImpression -> event, ima (x), tag (/)
	// adsManager (x) -> adsManager, videoElement
	// adRequest -> ima (x), tag (/)
	// adError -> ima, tag (/), adPlayId (x), message (/), adErrorCode (x)
	// hdPlayerEvent (x) -> details.slotStatus.{vastParams, statusName}, details.name, details.errorCode
}
