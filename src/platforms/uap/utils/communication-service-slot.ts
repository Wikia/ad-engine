import { AD_ENGINE_SLOT_EVENT } from "../../../communication/events/events-ad-engine-slot";
import { communicationServiceSlim } from "./communication-service-slim";

export class CommunicationServiceSlot {
    emit(slotName: string, event: string | symbol, data: any = {}, serialize = true) {
        communicationServiceSlim.emit(AD_ENGINE_SLOT_EVENT, {
            event: event.toString(),
            slot: slotName,
            adSlotName: slotName,
            payload: serialize ? JSON.parse(JSON.stringify(data)) : data,
        });
    }
}

export const communicationServiceSlot = new CommunicationServiceSlot();
