import { Binder } from '@ad-engine/core';
import { F2State } from './f2-state';

export const F2_STATE = Symbol('F2 State');

export function getF2StateBinder(): Binder<F2State> {
	// @ts-ignore global fandom variable not created by our code
	window.fandom = window.fandom || {};
	// @ts-ignore global fandom.config variable not created by our code
	window.fandom.config = window.fandom.config || {};
	// @ts-ignore global fandom variable not created by our code
	const state = window.fandom;

	return {
		bind: F2_STATE,
		value: state,
	};
}
