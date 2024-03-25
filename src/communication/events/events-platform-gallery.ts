import { props } from "ts-action";

export const PLATFORM_LIGHTBOX_READY = {
    category: '[Platform]',
        name: 'Lightbox ready',
        payload: props<{ placementId: string }>(),
} as const;
export const PLATFORM_LIGHTBOX_CLOSED = {
    category: '[Platform]',
        name: 'Lightbox closed',
        payload: props<{ placementId: string }>(),
} as const;
export const PLATFORM_LIGHTBOX_IMAGE_CHANGE = {
    category: '[Platform]',
        name: 'Lightbox image change',
        payload: props<{ placementId: string }>(),
} as const;
