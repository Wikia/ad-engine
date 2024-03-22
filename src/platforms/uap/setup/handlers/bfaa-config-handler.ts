import { TemplateStateHandler } from "../../../../core/services/templates-registry/template-state-handler";
import { universalAdPackage, UapParams, registerUap } from "../../utils/universal-ad-package";

import { AD_ENGINE_UAP_NTC_LOADED } from "../../../../communication/events/events-ad-engine-uap";
import { communicationServiceSlim } from "../../utils/communication-service-slim";

export class BfaaConfigHandler implements TemplateStateHandler {
    constructor(private params: UapParams) {}

    async onEnter(): Promise<void> {
        if (this.params.newTakeoverConfig) {
            communicationServiceSlim.emit(AD_ENGINE_UAP_NTC_LOADED);
        }

        universalAdPackage.init(this.params);
        registerUap();
    }
}
