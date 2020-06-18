import { globalAction } from '@wikia/ad-engine';
import { props } from 'ts-action';

export const F2_ENV = Symbol('f2 Environment');

export interface F2Environment {
	skinName: string;
	siteType: string;
	isPageMobile: boolean;
	isAdMirror: boolean;
	isProduction: boolean;
	isSteam: boolean;
}

export const f2Ready = globalAction('[F2] Configured', props<F2Environment>());
