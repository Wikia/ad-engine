import { communicationService, ofType } from '@ad-engine/communication';
import { AdSlot, slotService } from '@ad-engine/core';
import { Injectable } from '@wikia/dependency-injection';
import { merge, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { JWPlayer } from './external-types/jwplayer';
import { JwplayerComscoreHandler } from './handlers/jwplayer-comscore-handler';
import { JWPlayerHandler } from './handlers/jwplayer-handler';
import { JWPlayerTrackingHandler } from './handlers/jwplayer-tracking-handler';
import { PlayerReadyResult } from './helpers/player-ready-result';
import { JwPlayerAdsFactoryOptions, jwpReady } from './jwplayer-actions';
import { createJwpStream } from './streams/jwplayer-stream';

@Injectable()
export class JWPlayerManager {
	manage(): void {
		this.onPlayerReady()
			.pipe(
				mergeMap((result: PlayerReadyResult) =>
					merge(
						new JWPlayerHandler().handle(result),
						new JWPlayerTrackingHandler().handle(result),
						new JwplayerComscoreHandler().handle(result),
					),
				),
			)
			.subscribe();
	}

	private onPlayerReady(): Observable<PlayerReadyResult> {
		return communicationService.action$.pipe(
			ofType(jwpReady),
			map(({ options, targeting, playerKey }) => {
				const jwplayer: JWPlayer = window[playerKey] as any;
				const adSlot = this.createAdSlot(options, jwplayer);
				const stream$ = createJwpStream(jwplayer);

				return { jwplayer, adSlot, targeting, stream$ };
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
}
