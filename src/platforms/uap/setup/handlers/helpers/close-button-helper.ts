import { UapParams } from "../../../utils/universal-ad-package";
import SlotPlaceholderRetriever from "../../../utils/slot-placeholder-retriever";
import { Observable } from "rxjs";
import { filter, startWith, take, tap } from "rxjs/operators";
import { DomListener } from "../manipulators/dom-listener";

export class CloseButtonHelper {
    private slotPlaceholderRetriever: SlotPlaceholderRetriever;

    constructor(private params: UapParams, private domListener: DomListener) {
        this.slotPlaceholderRetriever = new SlotPlaceholderRetriever(this.params);
    }

    appendOnScroll(button: HTMLButtonElement): Observable<unknown> {
        return this.domListener.scroll$.pipe(
            startWith({}),
            filter(() => window.scrollY > 0),
            take(1),
            tap(() => this.slotPlaceholderRetriever.get().appendChild(button)),
        );
    }
}
