// @ts-nocheck [WIP]
import { UapTemplateSetup } from "./setup/uap-template-setup";

window.ads = window.ads || {};
window.ads.loadUap = (params) => {
    if (params.type !== 'bfaa') {
        return;
    }

    const template = new UapTemplateSetup();
    template.start(params);
};

window.postMessage({
    'name': 'UAP-pkg',
    'type': 'init',
    'status': 'done',
    'data': {},
}, '*');

