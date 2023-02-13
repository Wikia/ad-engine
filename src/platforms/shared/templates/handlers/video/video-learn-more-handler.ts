import { PorvataPlayer, TemplateStateHandler } from '@wikia/ad-engine';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { injectable } from 'tsyringe';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { PlayerRegistry } from '../../helpers/player-registry';

/**
 * Displays Learn More link
 */
@injectable()
export class VideoLearnMoreHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(private playerRegistry: PlayerRegistry, private manipulator: DomManipulator) {}

	async onEnter(): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				take(1),
				tap(({ player }) => this.setLearnMoreBlockDisplay(player)),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private setLearnMoreBlockDisplay(player: PorvataPlayer): void {
		const playerContainer: HTMLElement = player.settings.getPlayerContainer();
		const learnMore: HTMLElement = playerContainer.querySelector('.learn-more');

		this.manipulator.element(learnMore).addClass('show-learn-more');
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
