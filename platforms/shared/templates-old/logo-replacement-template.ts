import { AdSlot, context, utils } from '@wikia/ad-engine';

export interface LogoReplacementTemplateConfig {
	logoImage: string;
	clickThroughUrl: string;
	pixelUrl: string;
	parentSelector: string;
	logoSelector: string;
	replaceLogo: (config: LogoReplacementTemplateConfig, adSlot: AdSlot) => void;
}

export class LogoReplacement {
	static getName(): string {
		return 'logoReplacement';
	}

	static getDefaultConfig(): object {
		return {};
	}

	config: LogoReplacementTemplateConfig;

	constructor(public adSlot: AdSlot) {
		this.adSlot = adSlot;
		this.config = context.get('templates.logoReplacement') || {};
	}

	init(params: LogoReplacementTemplateConfig): void {
		utils.logger(LogoReplacement.getName(), 'init');
		this.config = { ...this.config, ...params };

		this.config.replaceLogo(this.config, this.adSlot);
	}
}
