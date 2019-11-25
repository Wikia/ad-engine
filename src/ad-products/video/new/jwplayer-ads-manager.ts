import { AdSlot, slotService } from '@ad-engine/core';
import { Communicator, ofType } from '@wikia/post-quecast';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { JwPlayerAdsFactoryOptions, loadMoatPlugin, VideoTargeting } from '../jwplayer-ads-factory';
import { JWPlayerReadyAction, SetupJWPlayerAction } from './jwplayer-actions';

export class JWPlayerAdsManager {
	private communicator = new Communicator();

	async run() {
		const { adSlot, tracker } = await this.onSetupPlayer().toPromise();
		const slotTargeting = await this.onPlayerReady().toPromise();
	}

	private onSetupPlayer(): Observable<{ adSlot: AdSlot; tracker: JWPlayerTracker }> {
		return this.communicator.actions$.pipe(
			ofType('[JWPlayer] setup player'),
			take(1),
			map((action: SetupJWPlayerAction) => action.payload),
			map((options: JwPlayerAdsFactoryOptions) => {
				const slotName = options.slotName || (options.featured ? 'featured' : 'video');
				const adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });

				if (!slotService.get(slotName)) {
					slotService.add(adSlot);
				}

				loadMoatPlugin();

				const tracker = new JWPlayerTracker({
					slotName,
					adProduct: adSlot.config.trackingKey,
					audio: options.audio,
					ctp: !options.autoplay,
					videoId: options.videoId,
				});

				return { adSlot, tracker };
			}),
		);
	}

	private onPlayerReady(): Observable<VideoTargeting> {
		return this.communicator.actions$.pipe(
			ofType('[JWPlayer] player ready'),
			take(1),
			map((action: JWPlayerReadyAction) => action.payload || {}),
		);
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
