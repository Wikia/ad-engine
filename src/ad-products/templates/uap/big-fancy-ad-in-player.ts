import { context } from '@wikia/ad-engine';
import { universalAdPackage } from './universal-ad-package';

export class BigFancyAdInPlayer {
	static getName() {
		return 'bfp';
	}

	static getDefaultConfig() {
		return {
			slotsToDisable: [],
			slotsToEnable: [],
		};
	}

	constructor() {
		this.config = context.get('templates.bfp');
	}

	/**
	 * Initializes the BFP unit
	 */
	init(params) {
		this.params = params;

		universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);
	}
}
