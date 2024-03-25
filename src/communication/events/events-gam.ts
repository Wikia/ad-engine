import { payload, props } from "ts-action";
import { AdIntervention, LoadTemplatePayload } from "../event-types";

export const GAM_AD_INTERVENTION = {
    category: '[GAM iframe]',
        name: 'Ad intervention',
        payload: props<AdIntervention>(),
} as const;
export const GAM_AD_DELAYED_COLLAPSE = {
    category: '[GAM iframe]',
        name: 'Delayed collapse',
        payload: props<{ source: string }>(),
} as const;
export const GAM_INTERSTITIAL_LOADED = {
    category: '[GAM iframe]',
        name: 'Interstitial loaded',
} as const;
export const GAM_LOAD_TEMPLATE = {
    category: '[GAM iframe]',
        name: 'Load template',
        payload: payload<LoadTemplatePayload>(),
} as const;
