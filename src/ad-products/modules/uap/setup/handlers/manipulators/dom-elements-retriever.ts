import { context } from "../../../../../../core/services/context-service";

export function getDomElements() {
    return {
        'navbar': document.querySelector(context.get('uap.dom.nav') ?? '.fandom-sticky-header'),
        'page': document.body,
        'footer': document.querySelector(context.get('uap.dom.footer') ?? '.global-footer'),
    };
}
