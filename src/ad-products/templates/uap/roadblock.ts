import { context } from '@ad-engine/core';
import { universalAdPackage } from './universal-ad-package';

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

	config: RoadblockTemplateConfig;

	constructor() {
		this.config = context.get('templates.roadblock') || {};
	}

	/**
	 * Initializes the Roadblock unit
	 */
	init(params: {}): void {
		this.params = params;
		this.params.adProduct = 'ruap';
		universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);

		if (this.config.onInit) {
			this.config.onInit();
		}
	}
}
