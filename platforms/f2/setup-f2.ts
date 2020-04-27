import { action, props } from 'ts-action';

export const F2_CONFIG = Symbol('f2 config');

export interface F2Config {
	isMobile: boolean;
	src: string;
	namespace: string;
	adLayout: string;
}

export const f2Ready = action('[F2] Configured', props<F2Config>());
