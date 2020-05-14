import { Porvata4Player, TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';
import { PlayerRegistry } from '../../helpers/player-registry';

/**
 * Displays Learn More link
 */
@Injectable({ autobind: false })
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

	private setLearnMoreBlockDisplay(player: Porvata4Player): void {
		const playerContainer: HTMLElement = player.settings.getPlayerContainer();
		const learnMore: HTMLElement = playerContainer.querySelector('.learn-more');

		this.manipulator.element(learnMore).addClass('show-learn-more');
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
