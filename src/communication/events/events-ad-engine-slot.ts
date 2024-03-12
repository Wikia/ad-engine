import { props } from "ts-action";
import { GeneralPayload, AdSlotEventPayload } from "../event-types";
import { Dictionary } from "../../core/models/dictionary";

export const AD_ENGINE_SLOT_ADDED = {
    name: 'Ad Slot added',
        payload: props<{ name: string; slot; state: string }>(),
} as const;
export const AD_ENGINE_SLOT_EVENT = {
    name: 'Ad Slot event',
        payload: props<AdSlotEventPayload>(),
} as const;
export const AD_ENGINE_SLOT_LOADED = {
    name: 'Ad Slot loaded',
        payload: props<GeneralPayload>(),
} as const;
export const AD_ENGINE_AD_RESIZED = {
    name: 'Ad slot resized',
        payload: props<{ slot; sizes: Dictionary }>(),
} as const;
export const AD_ENGINE_INVALIDATE_SLOT_TARGETING = {
    name: 'Invalidate slot targeting',
        payload: props<{ slot }>(),
} as const;
