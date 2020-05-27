import { AdSlot, context, events, utils } from '@ad-engine/core';

export interface LogoReplacementTemplateConfig {
	logoImage?: string;
	clickThroughUrl?: string;
	pixelUrl?: string;
	replaceLogo?: (logoImage: string, pixelUrl: string, clickThroughUrl: string) => void;
}

export class LogoReplacement {
	static getName(): string {
		return 'logoReplacement';
	}

	static getDefaultConfig(): LogoReplacementTemplateConfig {
		return {};
	}

	config: LogoReplacementTemplateConfig;

	constructor(public adSlot: AdSlot) {
		this.config = context.get('templates.logoReplacement') || {};
	}

	init(params: LogoReplacementTemplateConfig): void {
		utils.logger(LogoReplacement.getName(), 'init');

		this.config = { ...this.config, ...params };

		if (this.config.clickThroughUrl === '') {
			this.config.clickThroughUrl = 'https://www.fandom.com/';
		}

		this.replaceLogo();
	}

	private replaceLogo(): void {
		this.config.replaceLogo(
			this.config.logoImage,
			this.config.pixelUrl,
			this.config.clickThroughUrl,
		);
		this.adSlot.emitEvent(events.LOGO_REPLACED);
	}
}
