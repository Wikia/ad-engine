import {
	Porvata4Player,
	PorvataTemplateParams,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { fromEvent } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { PlayerRegistry } from '../helpers/player-registry';

@Injectable()
export class VideoCtpHandler implements TemplateStateHandler {
	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		this.playerRegistry.video$.pipe(take(1)).subscribe(({ player, params }) => {
			this.handleCtpStart(player, params, transition);
		});
	}

	private handleCtpStart(
		player: Porvata4Player,
		params: PorvataTemplateParams,
		transition: TemplateTransition<'impact'>,
	): void {
		if (!params.autoPlay) {
			fromEvent(player, 'wikiaAdStarted')
				.pipe(
					take(1),
					tap(() => {
						transition('impact', { allowMulticast: true });
					}),
				)
				.subscribe();
		}
	}

	async onLeave(): Promise<void> {}
}
