import { props } from "ts-action";
import { UapLoadStatus } from "../event-types";

export const AD_ENGINE_UAP_DOM_CHANGED = {
    name: 'UAP DOM changed',
    payload: props<{ element: string; size: number }>(),
} as const;
export const AD_ENGINE_UAP_LOAD_STATUS = {
    name: 'UAP Load status',
    payload: props<UapLoadStatus>(),
} as const;
export const AD_ENGINE_UAP_NTC_LOADED = {
    name: 'UAP NTC loaded',
} as const;
