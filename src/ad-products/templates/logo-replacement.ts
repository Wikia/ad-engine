import { AdSlot, context, events, utils } from '@ad-engine/core';

export interface LogoReplacementTemplateConfig {
	logoImage?: string;
	clickThroughUrl?: string;
	pixelUrl?: string;
	parentSelector: string;
	fandomLogoSelector: string;
}

export class LogoReplacement {
	static getName(): string {
		return 'logoReplacement';
	}

	static getDefaultConfig(): LogoReplacementTemplateConfig {
		return {
			parentSelector: '.wds-global-navigation__content-bar-left',
			fandomLogoSelector: '.wds-global-navigation__logo',
		};
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
		const parentElement = document.querySelector(this.config.parentSelector);
		const fandomLogo = document.querySelector(this.config.fandomLogoSelector);

		if (parentElement && fandomLogo) {
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = this.config.clickThroughUrl;

			const newLogo = document.createElement('img');
			newLogo.src = this.config.logoImage;

			const trackingPixel = document.createElement('img');
			trackingPixel.src = this.config.pixelUrl;
			trackingPixel.style.display = 'none';

			parentElement.insertBefore(newLogoAnchorElement, fandomLogo);
			parentElement.removeChild(fandomLogo);
			parentElement.appendChild(trackingPixel);
			newLogoAnchorElement.appendChild(newLogo);

			this.adSlot.emitEvent(events.LOGO_REPLACED);
		}
	}
}
