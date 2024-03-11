import { props } from "ts-action";
import { CcpaSignalPayload, GdprConsentPayload, GeneralPayload } from "@ad-engine/communication";

export const AD_ENGINE_BAB_DETECTION = {
    category: '[Ad Engine]',
        name: 'BAB detection finished',
        payload: props<{ detected: boolean }>(),
} as const;
export const AD_ENGINE_CONFIGURED = {
    name: 'Configured',
} as const;
export const AD_ENGINE_CONSENT_READY = {
    category: '[AdEngine OptIn]',
        name: 'set opt in',
        payload: props<GdprConsentPayload & CcpaSignalPayload>(),
} as const;
export const AD_ENGINE_CONSENT_UPDATE = {
    category: '[AdEngine OptIn]',
        name: 'update opt in',
        payload: props<GdprConsentPayload & CcpaSignalPayload>(),
} as const;
export const AD_ENGINE_GPT_READY = {
    name: 'GPT Ready',
} as const;
export const AD_ENGINE_INSTANT_CONFIG_CACHE_RESET = {
    name: 'Instant Config cache reset',
} as const;
export const AD_ENGINE_INSTANT_CONFIG_CACHE_READY = {
    name: 'Instant Config cache ready',
} as const;
export const AD_ENGINE_INTERSTITIAL_DISPLAYED = {
    name: 'Interstitial displayed',
} as const;
export const AD_ENGINE_LOAD_TIME_INIT = {
    name: 'Ad engine load time init',
} as const;
export const AD_ENGINE_MESSAGE_BOX_EVENT = {
    name: 'MessageBox event',
        payload: props<{ adSlotName: string; ad_status: string }>(),
} as const;
export const AD_ENGINE_PARTNERS_READY = {
    name: 'Partners Ready',
} as const;
export const AD_ENGINE_STACK_START = {
    name: 'Ad Stack started',
} as const;
export const AD_ENGINE_STACK_COMPLETED = {
    name: 'Ad Stack completed',
} as const;
export const AD_ENGINE_TEMPLATE_LOADED = {
    name: 'Template loaded',
        payload: props<GeneralPayload>(),
} as const;
