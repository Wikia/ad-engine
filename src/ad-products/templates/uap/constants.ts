import { Dictionary } from '@ad-engine/core';

export const CSS_TIMING_EASE_IN_CUBIC = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
// Animation time is defined also in CSS, remember to change it in both places
export const SLIDE_OUT_TIME = 600;

export const DEFAULT_UAP_ID = 'none';
export const DEFAULT_UAP_TYPE = 'none';
export const FAN_TAKEOVER_TYPES = ['uap', 'vuap'];

export const BFAA_UNSTICK_DELAY = 3000;
export const TLB_UNSTICK_DELAY = 2000;

export const SLOT_FORCE_UNSTICK = 'force-unstick';
export const SLOT_UNSTICKED_STATE = 'unsticked';
export const SLOT_STICKED_STATE = 'sticked';
export const SLOT_STICKY_READY_STATE = 'sticky-ready';
export const SLOT_STICKINESS_DISABLED = 'stickiness-disabled';

export const UAP_ADDITIONAL_SIZES: Dictionary<Dictionary<[number, number]>> = {
	desktop: {
		bfaSize: [3, 3],
		companionSize: [5, 5],
		companionOriginalSize: [300, 600],
	},
	mobile: {
		bfaSize: [2, 2],
		companionSize: [4, 4],
		companionOriginalSize: [300, 250],
	},
};
