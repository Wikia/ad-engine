import { UapParams } from "./universal-ad-package";
// eslint-disable-next-line no-restricted-imports
import { logger } from "../../../core/utils/logger";

export default class SlotPlaceholderRetriever {
    private slotPlaceholder: HTMLElement | null;
    private singleSlotName;

    constructor(params: UapParams) {
        this.singleSlotName = params.slotName;
        if (this.singleSlotName.includes(',')) {
            this.singleSlotName = this.singleSlotName.split(',')[0];
        }
        this.slotPlaceholder = document.querySelector(`div[id="${this.singleSlotName}"]`);
    }

    get(): HTMLElement | null {
        return this.slotPlaceholder;
    }

    getContainer(): HTMLDivElement | null {
        return this.get().querySelector<HTMLDivElement>('div[id*="_container_"]');
    }

    getIframe(): HTMLIFrameElement | null {
        return this.get().querySelector('div[id*="_container_"] iframe');
    }

    onReady(): Promise<HTMLIFrameElement | HTMLElement> {
        return new Promise<HTMLIFrameElement>((resolve) => {
            const iframe: HTMLIFrameElement = this.getIframe();
            let iframeDocument = null;

            try {
                iframeDocument = iframe.contentWindow.document;
            } catch (ignore) {
                logger('SlotPlaceholderRetriever', this.singleSlotName, 'loaded through SafeFrame');
            }

            if (iframeDocument && iframeDocument.readyState === 'complete') {
                resolve(iframe);
            } else {
                iframe.addEventListener('load', () => resolve(iframe));
            }
        });
    }
}
