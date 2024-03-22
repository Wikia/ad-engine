import { fromEvent, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { PlayerRegistry } from "./video/player-registry";
import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";

/**
 * Transition to impact when video clicked to play
 */
export class VideoCtpHandler implements TemplateStateHandler {
    private destroy$ = new Subject<void>();

    constructor(private playerRegistry: PlayerRegistry) {}

    async onEnter(transitionCallback): Promise<void> {
        this.playerRegistry.video$
            .pipe(
                take(1),
                filter(({ params }) => !params.autoPlay),
                switchMap(({ player }) => fromEvent(player, 'wikiaAdStarted').pipe(take(1))),
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
