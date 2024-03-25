import { props } from "ts-action";
import { VideoAdsOptions } from "../event-types";

export const VIDEO_SETUP = {
    category: '[Video]',
    name: 'Setup done',
    payload: props<{
        autoplayDisabled: boolean;
        showAds: boolean;
        videoAdUnitPath: string;
        targetingParams: string;
    }>(),
} as const;
export const VIDEO_EVENT = {
    category: '[Video]',
    name: 'Video event',
        payload: props<{ videoEvent: object }>(),
} as const;
export const VIDEO_PLAYER_TRACKING = {
    category: '[Video]',
    name: 'Video player tracking',
    payload: props<{ eventInfo: object }>(),
} as const;
export const VIDEO_PLAYER_RENDERED = {
    category: '[Video]',
    name: 'Player rendered',
    payload: props<{ renderId: string; videoAdsOptions: VideoAdsOptions }>(),
} as const;
