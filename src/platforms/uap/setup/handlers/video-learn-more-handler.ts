import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { PlayerRegistry } from "./video/player-registry";
import { DomManipulator } from "./manipulators/dom-manipulator";
import { PorvataPlayer } from "./video/porvata/porvata-player";

/**
 * Displays Learn More link
 */
export class VideoLearnMoreHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private playerRegistry: PlayerRegistry,
		private manipulator: DomManipulator
	) {}

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
