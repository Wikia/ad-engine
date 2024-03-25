import { fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from "./video/player-registry";
import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { UapParams, universalAdPackage } from "../../utils/universal-ad-package";
import { communicationServiceSlot } from "../../utils/communication-service-slot";

/**
 * Transition to resolved when video completes
 */
export class VideoCompletedHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(
		private params: UapParams,
		private playerRegistry: PlayerRegistry,
	) {}

	async onEnter(transitionCallback): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				switchMap(({ player }) => fromEvent(player, 'wikiaAdCompleted')),
				tap(() => {
					communicationServiceSlot.emit(this.params.slotName, universalAdPackage.SLOT_VIDEO_DONE)
					transitionCallback('resolved');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
