import { context } from '@ad-engine/core';
import { UapParams, universalAdPackage } from './universal-ad-package';

export interface RoadblockTemplateConfig {
	slotsToEnable: string[];
	slotsToDisable: string[];
	onInit: () => void;
}

export class Roadblock {
	static getName(): string {
		return 'roadblock';
	}

	static getDefaultConfig(): RoadblockTemplateConfig {
		return {
			slotsToEnable: [],
			slotsToDisable: [],
			onInit: () => {},
		};
	}

	private config: RoadblockTemplateConfig;
	private params: UapParams;

	constructor() {
		this.config = context.get('templates.roadblock') || {};
	}

	/**
	 * Initializes the Roadblock unit
	 */
	init(params: UapParams): void {
		this.params = params;
		this.params.adProduct = 'ruap';
		universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);

		if (this.config.onInit) {
			this.config.onInit();
		}
	}
}
