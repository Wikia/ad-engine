import { globalAction } from '@ad-engine/communication';
import { props } from 'ts-action';

export const F2_ENV = Symbol('f2 Environment');

export interface F2Environment {
	skinName: string;
	siteType: string;
	hasRightRail: boolean;
	isPageMobile: boolean;
	isAdMirror: boolean;
	isProduction: boolean;
	isSteam: boolean;
}

export const f2Ready = globalAction('[F2] Configured', props<F2Environment>());
