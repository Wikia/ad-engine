import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManager } from './manipulators/dom-manager';
import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { DomListener } from "./manipulators/dom-listener";

export class SlotSizeResolvedWithPlaceholderHandler implements TemplateStateHandler {
    private unsubscribe$ = new Subject<void>();

    constructor(private domListener: DomListener, private manager: DomManager) {}

    async onEnter(): Promise<void> {
        this.manager.setResolvedImage();
        this.domListener.resize$
            .pipe(
                startWith({}),
                tap(() => {
                    this.manager.setSlotHeightResolved();
                    this.manager.setPlaceholderHeightResolved();
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    async onLeave(): Promise<void> {
        this.unsubscribe$.next();
    }
}
