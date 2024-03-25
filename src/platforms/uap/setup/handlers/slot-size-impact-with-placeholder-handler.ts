import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';
import { DomManager } from './manipulators/dom-manager';
import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { DomListener } from "./manipulators/dom-listener";
import { UapParams } from "../../utils/universal-ad-package";
import { tapOnce } from "../../../../core/rxjs/tap-once";
import { context } from "../../../../core/services/context-service";

export class SlotSizeImpactWithPlaceholderHandler implements TemplateStateHandler {
    private unsubscribe$ = new Subject<void>();

    constructor(
        private params: UapParams,
        private domListener: DomListener,
        private manager: DomManager,
    ) {}

    async onEnter(): Promise<void> {
        if (context.get('state.isMobile') && !!this.params.thumbnail) {
            this.setImpactSizeOnScroll();
        } else {
            this.manager.setImpactImage();
        }

        this.domListener.resize$
            .pipe(
                startWith({}),
                tap(() => {
                    this.manager.setSlotHeightImpact();
                    this.manager.setPlaceholderHeightImpact();
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    async onLeave(): Promise<void> {
        this.unsubscribe$.next();
    }

    private setImpactSizeOnScroll(): void {
        this.domListener.scroll$
            .pipe(
                tapOnce(() => {
                    this.manager.setImpactImage();
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }
}
