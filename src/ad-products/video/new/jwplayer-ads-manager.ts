import { AdSlot, slotService } from '@ad-engine/core';
import { Communicator, ofType } from '@wikia/post-quecast';
import { merge, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { JwPlayerAdsFactoryOptions, loadMoatPlugin, VideoTargeting } from '../jwplayer-ads-factory';
import { JWPlayerReadyAction } from './jwplayer-actions';

export class JWPlayerAdsManager {
	private communicator = new Communicator();

	async run() {
		const { adSlot, tracker, slotTargeting } = await this.onPlayerReady().toPromise();
	}

	private onPlayerReady(): Observable<{
		slotTargeting: VideoTargeting;
		tracker: JWPlayerTracker;
		adSlot: AdSlot;
	}> {
		const playerReady$ = this.communicator.actions$.pipe(ofType('[JWPlayer] player ready'));

		const loadPlugin$ = playerReady$.pipe(
			take(1),
			tap(() => loadMoatPlugin()),
			filter(() => false),
		);

		const createValues$ = playerReady$.pipe(
			map((action: JWPlayerReadyAction) => {
				const adSlot = this.createAdSlot(action.options);
				const tracker = this.createTracker(action.options, adSlot);

				return { adSlot, tracker, slotTargeting: action.targeting };
			}),
		);

		return merge(loadPlugin$, createValues$);
	}

	private createAdSlot(options: JwPlayerAdsFactoryOptions): AdSlot {
		const slotName = options.slotName || (options.featured ? 'featured' : 'video');
		const adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });

		if (!slotService.get(slotName)) {
			slotService.add(adSlot);
		}

		return adSlot;
	}

	private createTracker(options: JwPlayerAdsFactoryOptions, adSlot: AdSlot): JWPlayerTracker {
		return new JWPlayerTracker({
			slotName: adSlot.config.slotName,
			adProduct: adSlot.config.trackingKey,
			audio: options.audio,
			ctp: !options.autoplay,
			videoId: options.videoId,
		});
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
