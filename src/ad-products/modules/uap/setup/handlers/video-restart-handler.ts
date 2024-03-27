import { TemplateStateHandler } from "../../../../../core/services/templates-registry/template-state-handler";
import { fromEvent, Subject } from 'rxjs';
import { skip, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from "./video/player-registry";

/**
 * Transition to impact when video is restarted
 */
export class VideoRestartHandler implements TemplateStateHandler {
	private destroy$ = new Subject<void>();

	constructor(private playerRegistry: PlayerRegistry) {}

	async onEnter(transitionCallback): Promise<void> {
		this.playerRegistry.video$
			.pipe(
				take(1),
				switchMap(({ player }) => fromEvent(player, 'wikiaAdStarted').pipe(skip(1))),
				tap(() => transitionCallback('impact', { allowMulticast: true })),
				takeUntil(this.destroy$),
			)
			.subscribe();
	}

	async onDestroy(): Promise<void> {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
