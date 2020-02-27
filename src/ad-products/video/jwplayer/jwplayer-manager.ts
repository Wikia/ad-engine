import { AdSlot, context, slotService, tapOnce, utils } from '@ad-engine/core';
import { Communicator } from '@wikia/post-quecast';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';
import { iasVideoTracker } from '../player/porvata/ias/ias-video-tracker';
import { JWPlayer } from './external-types/jwplayer';
import { JWPlayerHelper } from './helpers/jwplayer-helper';
import { JWPlayerTrackingHelper } from './helpers/jwplayer-tracking-helper';
import { JwPlayerAdsFactoryOptions, jwpReady, VideoTargeting } from './jwplayer-actions';
import { JWPlayerHandler } from './jwplayer-handler';
import { createJwpStream } from './streams/jwplayer-stream';

interface PlayerReadyResult {
	jwplayer: JWPlayer;
	adSlot: AdSlot;
	targeting: VideoTargeting;
}

export class JWPlayerManager {
	private communicator = new Communicator();

	manage(): void {
		this.onPlayerReady()
			.pipe(
				map((result) => this.createJWPlayerHandler(result)),
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
				const jwplayer: JWPlayer = window[playerKey];
				const adSlot = this.createAdSlot(options, jwplayer);

				return { jwplayer, adSlot, targeting };
			}),
		);
	}

	private createAdSlot(options: JwPlayerAdsFactoryOptions, jwplayer: JWPlayer): AdSlot {
		const slotName = options.slotName || (options.featured ? 'featured' : 'video');
		const adSlot = slotService.get(slotName) || new AdSlot({ id: slotName });
		const videoElement = jwplayer && jwplayer.getContainer && jwplayer.getContainer();

		adSlot.element = videoElement && (videoElement.parentNode as HTMLElement);
		adSlot.setConfigProperty('audio', !jwplayer.getMute());
		adSlot.setConfigProperty('autoplay', jwplayer.getConfig().autostart);

		if (!slotService.get(slotName)) {
			slotService.add(adSlot);
		}

		return adSlot;
	}

	private createJWPlayerHandler({
		jwplayer,
		adSlot,
		targeting,
	}: PlayerReadyResult): JWPlayerHandler {
		const stream$ = createJwpStream(jwplayer);
		const tracker = new JWPlayerTrackingHelper(adSlot);
		const helper = new JWPlayerHelper(adSlot, jwplayer, targeting);

		return new JWPlayerHandler(stream$, helper, tracker);
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
