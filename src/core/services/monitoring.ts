import {communicationService, eventsRepository} from '@ad-engine/communication';
import {AdSlot} from "../models";
import {context} from "./context-service";

export class Monitoring {
    constructor() {
        this.trackGamSlotRequest();
        this.trackGamSlotRendered();
        this.trackSlotClicked();
        this.clickHookOnIframe = this.clickHookOnIframe.bind(this);
        this.clickHookOnIframe('');
    }

    private trackGamSlotRequest() {
        communicationService.onSlotEvent(AdSlot.SLOT_REQUESTED_EVENT, ({ slot }) => {
            this.sendDataToMeteringSystem(slot.getSlotName(), 'request');
        });
    }

    private trackGamSlotRendered() {
        communicationService.onSlotEvent(AdSlot.SLOT_RENDERED_EVENT, ({ slot }) => {
            this.sendDataToMeteringSystem(slot.getSlotName(), 'render');
        });
    }

    private trackSlotClicked() {
        communicationService.on(eventsRepository.AD_ENGINE_AD_CLICKED, (data) => {
            this.sendDataToMeteringSystem(data.slotName, 'click');
        });
    }

    private sendDataToMeteringSystem(slotName: string, state: string) {
        const baseUrl = context.get('services.monitoring.endpoint') || 'http://localhost:8080';
        const service = context.get('services.monitoring.service') || '';
        const appName = context.get('services.instantConfig.appName');

        const endpointUrl = [
            baseUrl,
            service,
            'api',
            'meter',
        ]
            .filter(element => !!element)
            .join('/');

        fetch(`${endpointUrl}?app=${appName}&slot=${slotName}&state=${state}`);
    }

    private clickHookOnIframe(prevTriggeredId: string) {
        const monitor = setInterval(() => {
            const elem = document.activeElement;
            if (!elem || elem.tagName !== 'IFRAME') {
                return;
            }

            const id: null | string = this.extractSlotId(elem);
            if (!id || id === prevTriggeredId) {
                return;
            }
            communicationService.emit(eventsRepository.AD_ENGINE_AD_CLICKED, {slotName: id});

            clearInterval(monitor);
            this.clickHookOnIframe(id);
        }, 250);
    }

    private extractSlotId(element): null | string {
        let i = 1;
        let currentElement = element;
        while (i <= 3) {
            i++;
            currentElement = currentElement.parentElement;
            if (currentElement && currentElement.id && currentElement.id.split('/').length > 1) {
                continue;
            }
            return currentElement.id;
        }
        return null;
    }
}