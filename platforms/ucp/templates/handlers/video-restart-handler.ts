import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { fromEvent } from 'rxjs';
import { map, skip, switchMap, take, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../helpers/player-registry';

/**
 * Transition to impact when video is restarted
 */
@Injectable()
export class VideoRestartHandler implements TemplateStateHandler {
	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				take(1),
				switchMap(({ player }) =>
					fromEvent(player, 'wikiaAdStarted').pipe(
						skip(1),
						map(() => player),
					),
				),
				tap((player) => {
					transition('impact', { allowMulticast: true });
					player.unmute();
				}),
			)
			.subscribe();
	}
	async onLeave(): Promise<void> {}
}
