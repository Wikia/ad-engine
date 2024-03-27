// @ts-strict-ignore
import { AdvertisementLabel } from "../../../../../ad-products/templates/interface/advertisement-label";
import { TemplateStateHandler } from "../../../../../core/services/templates-registry/template-state-handler";
import { UapParams } from "../../utils/universal-ad-package";
import SlotPlaceholderRetriever from "../../utils/slot-placeholder-retriever";

export class AdvertisementLabelHandler implements TemplateStateHandler {
    constructor(
        private params: UapParams,
    ) {}

    async onEnter(): Promise<void> {
        const adSlotElement = (new SlotPlaceholderRetriever(this.params)).get();
        const advertisementLabel = adSlotElement.querySelector('.advertisement-label');
        if (advertisementLabel) {
            return;
        }

        const newAdvertisementLabel = new AdvertisementLabel();
        adSlotElement.appendChild(newAdvertisementLabel.render());
    }
}
