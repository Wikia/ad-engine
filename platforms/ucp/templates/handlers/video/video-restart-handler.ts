import { TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { fromEvent } from 'rxjs';
import { skip, switchMap, take, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';

/**
 * Transition to impact when video is restarted
 */
@Injectable({ autobind: false })
export class VideoRestartHandler implements TemplateStateHandler {
	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				take(1),
				switchMap(({ player }) => fromEvent(player, 'wikiaAdStarted').pipe(skip(1))),
				tap(() => transition('impact', { allowMulticast: true })),
			)
			.subscribe();
	}
	async onLeave(): Promise<void> {}
}
