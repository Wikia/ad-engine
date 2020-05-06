import { Binder } from '@wikia/ad-engine';

export const F2_STATE = Symbol('F2 State');

export function getF2StateBinder(): Binder {
	// @ts-ignore
	window.fandom = window.fandom || {};
	// @ts-ignore
	window.fandom.config = window.fandom.config || {};
	// @ts-ignore
	const state = window.fandom;

	return {
		bind: F2_STATE,
		value: state,
	};
}
