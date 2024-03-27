import { Subject } from 'rxjs';
import { filter, startWith, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { TemplateStateHandler } from "../../../../../core/services/templates-registry/template-state-handler";
import { UapParams, universalAdPackage } from "../../utils/universal-ad-package";
import { DomReader } from "./manipulators/dom-reader";
import { communicationServiceSlot } from "../../utils/communication-service-slot";
import { AdSlotEvent } from "../../../../../core/models/ad-slot-event";
import { StickinessTimeout } from "./helpers/stickiness-timeout";
import { ScrollCorrector } from "./helpers/scroll-corrector";
import { DomListener } from "./manipulators/dom-listener";

export class SlotDecisionImpactToResolvedHandler implements TemplateStateHandler {
    private unsubscribe$ = new Subject<void>();

    constructor(
        private params: UapParams,
        private domListener: DomListener,
        private scrollCorrector: ScrollCorrector,
        private reader: DomReader,
        private timeout: StickinessTimeout,
    ) {}

    async onEnter(transitionCallback): Promise<void> {
        this.domListener.scroll$
            .pipe(
                startWith({}),
                withLatestFrom(this.timeout.isViewedAndDelayed()),
                filter(() => this.reachedResolvedSize()),
                tap(([, viewedAndDelayed]) => {
                    const correction = this.scrollCorrector.usePositionCorrection();

                    if (viewedAndDelayed) {
                        communicationServiceSlot.emit(this.params.slotName, AdSlotEvent.CUSTOM_EVENT, { status: universalAdPackage.SLOT_STICKY_STATE_SKIPPED });

                        transitionCallback('transition').then(correction);
                    } else {
                        transitionCallback('sticky').then(correction);
                    }
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    private reachedResolvedSize(): boolean {
        return this.reader.getProgressImpactToResolved() === 1;
    }

    async onLeave(): Promise<void> {
        this.unsubscribe$.next();
    }
}
