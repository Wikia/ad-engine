import { context } from '@ad-engine/core';
import { UapParams, universalAdPackage } from './universal-ad-package';

export interface BigFancyAdInPlayerConfig {
	slotsToEnable: string[];
	slotsToDisable: string[];
}

export class BigFancyAdInPlayer {
	static getName(): string {
		return 'bfp';
	}

	static getDefaultConfig(): BigFancyAdInPlayerConfig {
		return {
			slotsToDisable: [],
			slotsToEnable: [],
		};
	}

	private config: BigFancyAdInPlayerConfig;
	private params: UapParams;

	constructor() {
		this.config = context.get('templates.bfp') || {};
	}

	/**
	 * Initializes the BFP unit
	 */
	init(params: UapParams): void {
		this.params = params;

		universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);
	}
}
