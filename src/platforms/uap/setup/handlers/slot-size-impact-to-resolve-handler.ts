import { merge, Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { DomListener } from "./manipulators/dom-listener";
import { DomManager } from "./manipulators/dom-manager";

export class SlotSizeImpactToResolvedHandler implements TemplateStateHandler {
    private unsubscribe$ = new Subject<void>();

    constructor(private domListener: DomListener, private manager: DomManager) {}

    async onEnter(): Promise<void> {
        merge(this.domListener.resize$, this.domListener.scroll$)
            .pipe(
                startWith({}),
                tap(() => this.manager.setSlotHeightImpactToResolved()),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    async onLeave(): Promise<void> {
        this.unsubscribe$.next();
    }
}
