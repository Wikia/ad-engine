import { from, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UapParams } from "../../../utils/universal-ad-package";
import SlotPlaceholderRetriever from "../../../utils/slot-placeholder-retriever";
import { communicationServiceSlim } from "../../../utils/communication-service-slim";
import { AdSlotEvent } from "../../../../../core/models/ad-slot-event";
import { wait } from "../../../../../core/utils/flow-control";
import * as constants from "../../../../../ad-products/templates/uap/constants";

/*eslint @typescript-eslint/no-unused-vars: "off"*/
// export type TemplateDependency<T = any> = Parameters<Container['bind']>[0];

export class StickinessTimeout {
    // static provide(defaultTimeout: number): TemplateDependency {
    //     return {
    //         bind: StickinessTimeout,
    //         provider: (container: Container) =>
    //             new StickinessTimeout(
    //                 container.get(TEMPLATE.PARAMS),
    //                 defaultTimeout,
    //             ),
    //     };
    // }

    private fallbackTimeout: number;
    private loaded: Promise<void>;

    constructor(
        params: UapParams,
        defaultTimeout: number = constants.BFAA_UNSTICK_DELAY,
    ) {
        this.fallbackTimeout = defaultTimeout;

        this.loaded = new Promise<void>((resolve) => {
            communicationServiceSlim.onSlotEvent(
                AdSlotEvent.SLOT_LOADED_EVENT,
                () => {
                    const slot = (new SlotPlaceholderRetriever(params)).get();
                    slot.dataset['slotLoaded'] = JSON.stringify(true);

                    resolve();
                },
                params.slotName,
            );
        });
    }

    isViewedAndDelayed(): Observable<boolean> {
        const bootstrap$ = of(false);
        const completed$ = from(this.loaded.then(() => wait(this.fallbackTimeout))).pipe(
            map(() => true),
        );

        return merge(bootstrap$, completed$);
    }
}
