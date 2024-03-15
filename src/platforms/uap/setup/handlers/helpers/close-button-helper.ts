import { UapParams } from "../../../utils/universal-ad-package";
import SlotPlaceholderRetriever from "../../../utils/slot-placeholder-retriever";

export class CloseButtonHelper {
    private slotPlaceholderRetriever: SlotPlaceholderRetriever;

    constructor(private params: UapParams) {
        this.slotPlaceholderRetriever = new SlotPlaceholderRetriever(this.params);
    }

    appendOnScroll(button: HTMLButtonElement) {
        this.slotPlaceholderRetriever.get().appendChild(button);
    }
}
