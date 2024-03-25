import { Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { UapParams, universalAdPackage } from "../../utils/universal-ad-package";
import { DomListener } from "./manipulators/dom-listener";
import { CommunicationServiceSlot, communicationServiceSlot } from "../../utils/communication-service-slot";
import { AdSlotEvent } from "../../../../core/models/ad-slot-event";
import { StickinessTimeout } from "./helpers/stickiness-timeout";

export class SlotDecisionTimeoutHandler implements TemplateStateHandler {
    private unsubscribe$ = new Subject<void>();
    private communicationServiceSlot: CommunicationServiceSlot;
    constructor(
        private params: UapParams,
        private domListener: DomListener,
        private timeout: StickinessTimeout,
    ) {
        this.communicationServiceSlot = communicationServiceSlot;
    }

    async onEnter(transitionCallback): Promise<void> {
        this.communicationServiceSlot.emit(this.params.slotName, AdSlotEvent.CUSTOM_EVENT, { status: universalAdPackage.SLOT_STICKED_STATE });

        this.timeout
            .isViewedAndDelayed()
            .pipe(
                filter((viewedAndDelayed: boolean) => viewedAndDelayed),
                switchMap(() => this.domListener.scroll$.pipe(take(1))),
                tap(() => {
                    this.communicationServiceSlot.emit(this.params.slotName, AdSlotEvent.CUSTOM_EVENT, { status: universalAdPackage.SLOT_UNSTICKED_STATE });
                    transitionCallback('transition');
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    async onLeave(): Promise<void> {
        this.unsubscribe$.next();
    }
}
