import { action, props } from 'ts-action';

export const F2_CONFIG = Symbol('f2 config');

export interface F2Config {
	src: string;
	skinName: string;
	pageType: string;
	hasFeaturedVideo: boolean;
	isPageMobile: boolean;
	isAdMirror: boolean;
	isProduction: boolean;
	isSteam: boolean;
}

export const f2Ready = action('[F2] Configured', props<F2Config>());
