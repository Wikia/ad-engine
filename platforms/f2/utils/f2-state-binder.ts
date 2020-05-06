import { Injectable } from '@wikia/dependency-injection';
import { F2State } from './f2-state';

@Injectable()
export class F2StateBinder {
	// @ts-ignore
	private state: F2State;

	constructor() {
		// @ts-ignore
		window.fandom = window.fandom || {};
		// @ts-ignore
		window.fandom.config = window.fandom.config || {};
		// @ts-ignore
		this.state = window.fandom;
	}
}
