import { AdSlot, slotService } from '@ad-engine/core';
import { Communicator } from '@wikia/post-quecast';
import { merge, Observable } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { JwPlayerAdsFactoryOptions, loadMoatPlugin, VideoTargeting } from '../jwplayer-ads-factory';
import { jwpReady } from './jwplayer-actions';
import { JWPlayerHandler } from './jwplayer-handlers/jwplayer-handler';
import { JWPlayer } from './jwplayer-plugin/jwplayer';

interface PlayerReadyResult {
	player: JWPlayer;
	adSlot: AdSlot;
	tracker: JWPlayerTracker;
	slotTargeting: VideoTargeting;
}

export class JWPlayerManager {
	private communicator = new Communicator();

	run() {
		this.onPlayerReady()
			.pipe(
				map((result) => this.createJWPlayerAd(result)),
				mergeMap((jwplayerAd) => jwplayerAd.run()),
			)
			.subscribe();
	}

	private onPlayerReady(): Observable<PlayerReadyResult> {
		const playerReady$ = this.communicator.actions$.pipe(ofType(jwpReady));

		const loadPlugin$: Observable<any> = playerReady$.pipe(
			take(1),
			tap(() => loadMoatPlugin()),
			filter(() => false),
		);

		const createValues$ = playerReady$.pipe(
			map(({ options, targeting, playerKey }) => {
				const player: JWPlayer = window[playerKey];
				const adSlot = this.createAdSlot(options, player);
				const tracker = this.createTracker(options, adSlot);

				return { player, adSlot, tracker, slotTargeting: targeting };
			}),
		);

		return merge(loadPlugin$, createValues$);
	}

	private createAdSlot(options: JwPlayerAdsFactoryOptions, player: JWPlayer): AdSlot {
		const slotName = options.slotName || (options.featured ? 'featured' : 'video');
		const adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });
		const videoElement = player && player.getContainer && player.getContainer();

		adSlot.element = videoElement && (videoElement.parentNode as HTMLElement);
		adSlot.setConfigProperty('audio', !player.getMute());
		adSlot.setConfigProperty('autoplay', player.getConfig().autostart);

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

	private createJWPlayerAd({
		player,
		adSlot,
		tracker,
		slotTargeting,
	}: PlayerReadyResult): JWPlayerHandler {
		return new JWPlayerHandler(adSlot, tracker, slotTargeting, player);
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
