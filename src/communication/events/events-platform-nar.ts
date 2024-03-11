import { props } from "ts-action";

export const PLATFORM_BEFORE_PAGE_CHANGE = {
    category: '[Platform]',
        name: 'Before page change',
} as const;
export const PLATFORM_PAGE_CHANGED = {
    category: '[Platform]',
        name: 'Page changed',
} as const;
export const PLATFORM_PAGE_EXTENDED = {
    category: '[Platform]',
        name: 'Page extended',
} as const;
export const PLATFORM_AD_PLACEMENT_READY = {
    category: '[Platform]',
        name: 'Ad placement ready',
        payload: props<{ placementId: string }>(),
} as const;
