// @ts-strict-ignore
import { AdSlotEvent } from "../../../../../core/models/ad-slot-event";
import { TemplateStateHandler } from "../../../../../core/services/templates-registry/template-state-handler";
import { universalAdPackage, UapParams } from "../../utils/universal-ad-package";
import { CloseButton } from "../../../../../ad-products/templates/interface/close-button";

import { CloseButtonHelper } from './helpers/close-button-helper';
import { communicationServiceSlot } from "../../utils/communication-service-slot";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

export class CloseToTransitionButtonHandler implements TemplateStateHandler {
    private button: HTMLButtonElement;
    private unsubscribe$ = new Subject<void>();

    constructor(private params: UapParams, private helper: CloseButtonHelper) {}

    async onEnter(transitionCallback): Promise<void> {
        this.button = new CloseButton({
            onClick: () => {
                communicationServiceSlot.emit(this.params.slotName, AdSlotEvent.CUSTOM_EVENT, { status: universalAdPackage.SLOT_FORCE_UNSTICK });
                transitionCallback('transition');
            },
        }).render();

        this.helper.appendOnScroll(this.button).pipe(takeUntil(this.unsubscribe$)).subscribe();
    }


    async onLeave(): Promise<void> {
        this.unsubscribe$.next();
        if (this.button) {
            this.button.remove();
        }
    }
}
