import { AdSlot, Porvata4Player, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { fromEvent, Observable } from 'rxjs';
// import { fromEvent } from 'rxjs';
import { filter, mergeMap, take, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../../helpers/player-registry';

/**
 * Transition to impact when video clicked to play
 */
@Injectable({ autobind: false })
export class VideoNoViewabilityHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		private playerRegistry: PlayerRegistry,
	) {}

	async onEnter(): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				filter(() => !this.adSlot.slotViewed),
				take(1),
				mergeMap(({ player }) => this.handlePause(player)),
			)
			.subscribe();
	}

	private handlePause(player: Porvata4Player): Observable<unknown> {
		return fromEvent(player, 'wikiaAdStarted').pipe(tap(() => player.pause()));
	}
}
