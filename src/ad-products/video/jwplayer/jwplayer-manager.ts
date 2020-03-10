import { AdSlot, context, slotService, tapOnce, utils } from '@ad-engine/core';
import { Communicator } from '@wikia/post-quecast';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';
import { JWPlayerTracker } from '../../tracking/video/jwplayer-tracker';
import { iasVideoTracker } from '../player/porvata/ias/ias-video-tracker';
import { JWPlayer } from './external-types/jwplayer';
import { JwPlayerAdsFactoryOptions, jwpReady, VideoTargeting } from './jwplayer-actions';
import { JWPlayerHandler } from './jwplayer-handler';
import { JWPlayerHelper } from './jwplayer-helper';
import { createJWPlayerStreams } from './jwplayer-streams';

interface PlayerReadyResult {
	player: JWPlayer;
	adSlot: AdSlot;
	tracker: JWPlayerTracker;
	slotTargeting: VideoTargeting;
}

export class JWPlayerManager {
	private communicator = new Communicator();

	manage(): void {
		this.onPlayerReady()
			.pipe(
				map((result) => this.createJWPlayerAd(result)),
				mergeMap((handler) => handler.handle()),
			)
			.subscribe();
	}

	private onPlayerReady(): Observable<PlayerReadyResult> {
		return this.communicator.actions$.pipe(
			ofType(jwpReady),
			tapOnce(() => {
				this.loadMoatPlugin();
				this.loadIasTrackerIfEnabled();
			}),
			map(({ options, targeting, playerKey }) => {
				const player: JWPlayer = window[playerKey];
				const adSlot = this.createAdSlot(options, player);
				const tracker = this.createTracker(options, adSlot);

				tracker.register(player); // TODO: need to handle it separately

				return { player, adSlot, tracker, slotTargeting: targeting };
			}),
		);
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
		const streams = createJWPlayerStreams(player);
		const helper = new JWPlayerHelper(adSlot, tracker, slotTargeting, player);

		return new JWPlayerHandler(streams, helper);
	}

	private loadMoatPlugin(): void {
		utils.scriptLoader.loadScript(context.get('options.video.moatTracking.jwplayerPluginUrl'));
	}

	private loadIasTrackerIfEnabled(): void {
		if (context.get('options.video.iasTracking.enabled')) {
			iasVideoTracker.loadScript();
		}
	}
}
