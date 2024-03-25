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
export const AD_ENGINE_UAP_UNLOCK = {
    name: 'Unlock slots after first call',
    payload: props<{ slotName: string }>(),
} as const;
export const AD_ENGINE_UAP_DISABLE = {
    name: 'Disable slots after first call',
    payload: props<{ slotName: string }>(),
} as const;
export const AD_ENGINE_UAP_LOADED = {
    name: 'UAP package loaded',
} as const;
