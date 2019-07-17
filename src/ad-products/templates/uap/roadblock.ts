import { context } from '@ad-engine/core';
import { universalAdPackage } from './universal-ad-package';

export class Roadblock {
	static getName() {
		return 'roadblock';
	}

	static getDefaultConfig() {
		return {
			slotsToEnable: [],
			slotsToDisable: [],
			onInit: () => {},
		};
	}

	constructor() {
		this.config = context.get('templates.roadblock') || {};
	}

	/**
	 * Initializes the Roadblock unit
	 */
	init(params) {
		this.params = params;
		this.params.adProduct = 'ruap';
		universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);

		if (this.config.onInit) {
			this.config.onInit();
		}
	}
}
