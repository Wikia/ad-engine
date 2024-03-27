// @ts-strict-ignore
import { from, Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TemplateStateHandler } from "../../../../../core/services/templates-registry/template-state-handler";
import { UapParams, universalAdPackage } from "../../utils/universal-ad-package";
import SlotPlaceholderRetriever from "../../utils/slot-placeholder-retriever";
import { wait } from "../../../../../core/utils/flow-control";
import { DomManipulator } from "./manipulators/dom-manipulator";
import { DomReader } from "./manipulators/dom-reader";
import { ScrollCorrector } from "./helpers/scroll-corrector";

export class SlotTransitionHandler implements TemplateStateHandler {
    private unsubscribe$ = new Subject<void>();
    private slotPlaceholderRetriever: SlotPlaceholderRetriever;

    constructor(
        private params: UapParams,
        private scrollCorrector: ScrollCorrector,
        private manipulator: DomManipulator,
        private reader: DomReader,
    ) {
        this.slotPlaceholderRetriever = new SlotPlaceholderRetriever(this.params);
    }

    async onEnter(transitionCallback): Promise<void> {
        this.animate()
            .pipe(
                tap(() => {
                    const correction = this.scrollCorrector.useScrollCorrection();
                    this.slotPlaceholderRetriever.get().classList.remove('uap-toc-pusher');

                    transitionCallback('resolved').then(correction);
                }),
                takeUntil(this.unsubscribe$),
            )
            .subscribe();
    }

    private animate(): Observable<unknown> {
        const duration = universalAdPackage.SLIDE_OUT_TIME;

        this.manipulator
            .element(this.slotPlaceholderRetriever.get())
            .setProperty('transition', `top ${duration}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`)
            .setProperty('top', `${this.reader.getSlotOffsetResolvedToNone()}px`);

        return from(wait(duration));
    }

    async onLeave(): Promise<void> {
        this.unsubscribe$.next();
    }
}
