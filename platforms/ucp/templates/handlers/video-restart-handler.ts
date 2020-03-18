import { Porvata4Player, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { fromEvent } from 'rxjs';
import { skip, take } from 'rxjs/operators';
import { PlayerRegistry } from '../helpers/player-registry';

@Injectable()
export class VideoRestartHandler implements TemplateStateHandler {
	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		this.playerRegistry.video$.pipe(take(1)).subscribe(({ player }) => {
			this.handleRestart(player, transition);
		});
	}

	/**
	 * Transition to impact when video is restarted
	 */
	private handleRestart(player: Porvata4Player, transition: TemplateTransition<'impact'>): void {
		const restarted$ = fromEvent(player, 'wikiaAdStarted').pipe(skip(1));

		restarted$.subscribe(() => {
			transition('impact', { allowMulticast: true });
			player.unmute();
		});
	}

	async onLeave(): Promise<void> {}
}
