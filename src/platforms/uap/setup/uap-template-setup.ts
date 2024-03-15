import { context } from "../../../core/services/context-service";
import { BfaaBootstrapHandler } from "./handlers/bfaa-bootstrap-handler";
import { BfaaConfigHandler } from "./handlers/bfaa-config-handler";
import { AdvertisementLabelHandler } from "./handlers/advertisement-label-handler";
import { DebugTransitionHandler } from "./handlers/debug-transition-handler";
import { DomCleanupHandler } from "./handlers/dom-cleanup-handler";
import { CloseToTransitionButtonHandler } from "./handlers/close-to-transmission-button-handler";
import { SlotSizeResolvedWithPlaceholderHandler } from "./handlers/slot-size-resolved-with-placeholder-handler";
import { SlotDecisionTimeoutHandler } from "./handlers/slot-decision-timeout-handler";
import { SlotTransitionHandler } from "./handlers/slot-transition-handler";
import { SlotHeightClippingHandler } from "./handlers/slot-height-clipping-handler";
import { SlotSizeImpactWithPlaceholderHandler } from "./handlers/slot-size-impact-with-placeholder-handler";
import { SlotSizeImpactToResolvedHandler } from "./handlers/slot-size-impact-to-resolve-handler";
import { SlotDecisionImpactToResolvedHandler } from "./handlers/slot-decision-impact-to-resolved-handler";
import { DomManager } from "./handlers/manipulators/dom-manager";
import { DomListener } from "./handlers/manipulators/dom-listener";
import { DomReader } from "./handlers/manipulators/dom-reader";
import { DomManipulator } from "./handlers/manipulators/dom-manipulator";
import { getDomElements } from "./handlers/manipulators/dom-elements-retriever";
import { StickinessTimeout } from "./handlers/helpers/stickiness-timeout";
import { CloseButtonHelper } from "./handlers/helpers/close-button-helper";
import { ScrollCorrector } from "./handlers/helpers/scroll-corrector";

export class UapTemplateSetup {
    private activeState = 'zero';
    private handlersPerState;
    private params;

    start(params) {
        this.params = params;
        this.handlersPerState = this.getTemplateState(params);
        this.activateState('initial');
        console.log('>>> UapTemplateSetup >>>', this.handlersPerState, this.params, this.activeState);

        // @TODO: add listener to slot destroying and call function "runHandlersDestroy"
    }

    private async activateState(stateName: string): Promise<void> {
        this.runHandlersLeaving(this.getHandlers(stateName));
        this.activeState = stateName;
        this.runHandlersEntering(this.getHandlers(stateName));

        Promise.resolve({});
    }

    private getHandlers(stateName: string) {
        return this.handlersPerState[stateName] ?? [];
    }

    private runHandlersLeaving(handlers) {
        handlers.forEach(handler => {
            if (handler.onLeave && typeof handler.onLeave === 'function') handler.onLeave();
        });
    }

    private runHandlersEntering(handlers) {
        handlers.forEach(handler => {
            if (handler.onEnter && typeof handler.onEnter === 'function') {
                handler.onEnter(this.activateState.bind(this)); // TemplateTransition
            }
        });
    }

    private getTemplateState(params) {
        const domElements = getDomElements();
        const domListener = new DomListener();
        const domManipulator = new DomManipulator();
        const domReader =new DomReader(params);
        const domManager = new DomManager(
            params,
            domManipulator,
            domReader,
        );
        const domCleanup = new DomCleanupHandler(params);
        const scrollCorrector = new ScrollCorrector(<HTMLElement>domElements['footer']);

        const slotSizeResolverWithPlaceholder = new SlotSizeResolvedWithPlaceholderHandler(domListener,domManager);
        const slotHeightClipping = new SlotHeightClippingHandler(domListener,domManager);
        const slotDecisionImpactResolver = new SlotDecisionImpactToResolvedHandler(
            params,
            domListener,
            scrollCorrector,
            domReader,
            new StickinessTimeout(params)
        );
        const slotSizeImpactResolverWithPlaceholder = new SlotSizeImpactWithPlaceholderHandler(params, domListener,domManager);

        const templateStates = {
            initial: [
                new BfaaConfigHandler(params), //
                new BfaaBootstrapHandler(params), //
                // VideoBootstrapHandler,
                // VideoCtpHandler,
                // VideoRestartHandler,
                new AdvertisementLabelHandler(params), //
                new DebugTransitionHandler(params.type), //
            ],
            impact: [],
            sticky: [
                slotSizeResolverWithPlaceholder,
                new SlotDecisionTimeoutHandler(params, domListener, new StickinessTimeout(params)), //
                new CloseToTransitionButtonHandler(params, new CloseButtonHelper(params)), //
                // VideoSizeResolvedHandler,
                domCleanup,
            ],
            transition: [
                slotSizeResolverWithPlaceholder,
                new SlotTransitionHandler(params, scrollCorrector, domManipulator, domReader), //
                // VideoSizeResolvedHandler,
                domCleanup,
            ],
            resolved: [
                slotSizeResolverWithPlaceholder,
                slotHeightClipping,
                // VideoSizeResolvedHandler,
                domCleanup,
            ],
        };

        if (context.get('state.isMobile')) {
            templateStates.impact = [
                slotSizeImpactResolverWithPlaceholder,
                new SlotSizeImpactToResolvedHandler(domListener,domManager), //
                slotDecisionImpactResolver,
                // VideoSizeImpactToResolvedHandler,
                // VideoCompletedHandler,
                // VideoLearnMoreHandler,
                domCleanup,
            ];
        } else {
            templateStates.impact = [
                slotSizeImpactResolverWithPlaceholder,
                slotDecisionImpactResolver,
                slotHeightClipping,
                // VideoSizeImpactToResolvedHandler,
                // VideoCompletedHandler,
                domCleanup,
            ];
        }

        return templateStates;
    }
}

