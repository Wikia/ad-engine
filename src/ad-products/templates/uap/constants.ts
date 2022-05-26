export const CSS_TIMING_EASE_IN_CUBIC = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
// Animation time is defined also in CSS, remember to change it in both places
export const SLIDE_OUT_TIME = 600;

export const DEFAULT_UAP_ID = 'none';
export const DEFAULT_UAP_TYPE = 'none';
export const FAN_TAKEOVER_TYPES = ['uap', 'vuap'];
export const SPECIAL_VIDEO_AD_UNIT = '/5441/uap';

export const BFAA_UNSTICK_DELAY = 3000;
export const TLB_UNSTICK_DELAY = 2000;

export const SLOT_FORCE_UNSTICK = 'force-unstick';
export const SLOT_UNSTICKED_STATE = 'unsticked';
export const SLOT_STICKED_STATE = 'sticked';
export const SLOT_STICKY_READY_STATE = 'sticky-ready';
export const SLOT_STICKY_STATE_SKIPPED = 'sticky-skipped';
export const SLOT_STICKINESS_DISABLED = 'stickiness-disabled';
export const SLOT_VIDEO_DONE = 'video-done';

interface UapAdditionalSizes {
	bfaSize: {
		desktop: [number, number];
		mobile: [number, number];
	};
	companionSizes: {
		[key: string]: {
			size: [number, number];
			originalSize: [number, number];
		};
	};
}

export const UAP_ADDITIONAL_SIZES: UapAdditionalSizes = {
	bfaSize: {
		desktop: [3, 3],
		mobile: [2, 2],
	},
	companionSizes: {
		'4x4': {
			size: [4, 4],
			originalSize: [300, 250],
		},
		'5x5': {
			size: [5, 5],
			originalSize: [300, 600],
		},
	},
};
