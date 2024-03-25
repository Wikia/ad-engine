import { UapTemplateSetup } from "../../platforms/uap/setup/uap-template-setup";

export function loadNewUap(): void {
        window['loadCustomAd'] = (params) => {
            if (params.type !== 'bfaa') {
                return;
            }

            const template = new UapTemplateSetup();
            template.start(params);
        };
    }
