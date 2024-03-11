import { props } from "ts-action";
import { AdSlot, Dictionary } from "@ad-engine/core";
import { GeneralPayload, AdSlotEventPayload } from "@ad-engine/communication";

export const AD_ENGINE_SLOT_ADDED = {
    name: 'Ad Slot added',
        payload: props<{ name: string; slot: AdSlot; state: string }>(),
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
        payload: props<{ slot: AdSlot; sizes: Dictionary }>(),
} as const;
export const AD_ENGINE_INVALIDATE_SLOT_TARGETING = {
    name: 'Invalidate slot targeting',
        payload: props<{ slot: AdSlot }>(),
} as const;
