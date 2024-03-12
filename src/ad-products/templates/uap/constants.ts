export const CSS_TIMING_EASE_IN_CUBIC = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)' as const;
// Animation time is defined also in CSS, remember to change it in both places
export const SLIDE_OUT_TIME = 600 as const;

export const DEFAULT_UAP_ID = 'none' as const;
export const DEFAULT_UAP_TYPE = 'none' as const;
export const FAN_TAKEOVER_TYPES = ['uap', 'vuap'] as const;
export const SPECIAL_VIDEO_AD_UNIT = '/5441/uap' as const;

export const BFAA_UNSTICK_DELAY = 3000 as const;
export const TLB_UNSTICK_DELAY = 2000 as const;

export const SLOT_FORCE_UNSTICK = 'force-unstick' as const;
export const SLOT_UNSTICKED_STATE = 'unsticked' as const;
export const SLOT_STICKED_STATE = 'sticked' as const;
export const SLOT_STICKY_READY_STATE = 'sticky-ready' as const;
export const SLOT_STICKY_STATE_SKIPPED = 'sticky-skipped' as const;
export const SLOT_STICKINESS_DISABLED = 'stickiness-disabled' as const;
export const SLOT_VIDEO_DONE = 'video-done' as const;

export interface UapAdditionalSizes {
	bfaSize: {
		desktop: [number, number];
		mobile: [number, number];
		unified: [number, number];
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
		desktop: <[number,number]>[3, 3],
		mobile: <[number,number]>[2, 2],
		unified: <[number,number]>[2, 3],
	},
	companionSizes: {
		'4x4': {
			size: <[number,number]>[4, 4],
			originalSize: <[number,number]>[300, 250],
		},
		'5x5': {
			size: <[number,number]>[5, 5],
			originalSize: <[number,number]>[300, 600],
		},
	},
} as const;
