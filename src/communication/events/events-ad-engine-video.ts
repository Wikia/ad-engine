import { props } from "ts-action";

export const AD_ENGINE_VIDEO_OVERLAY_CLICKED = {
    name: 'Video overlay added',
        payload: props<{ adSlotName: string; ad_status: string }>(),
} as const;
export const AD_ENGINE_VIDEO_TOGGLE_UI_OVERLAY_CLICKED = {
    name: 'Video toggle ui overlay clicked',
        payload: props<{ adSlotName: string; ad_status: string }>(),
} as const;
export const AD_ENGINE_VIDEO_LEARN_MORE_CLICKED = {
    name: 'Video learn more displayed',
        payload: props<{ adSlotName: string; ad_status: string }>(),
} as const;
