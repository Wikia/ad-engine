import { AdSlot, context, events, utils } from '@wikia/ad-engine';

export interface LogoReplacementTemplateConfig {
	logoImage: string;
	clickThroughUrl: string;
	pixelUrl: string;
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

		this.replaceLogo();
	}

	replaceLogo(): void {
		const parentElement = document.querySelector('.header__container');
		const logo = document.querySelector('.header__home-link');

		if (parentElement && logo) {
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = this.config.clickThroughUrl || 'https://www.fandom.com/';

			const newLogo = document.createElement('img');
			newLogo.src = this.config.logoImage;
			newLogo.classList.add('new-logo');

			const trackingPixel = document.createElement('img');
			trackingPixel.src = this.config.pixelUrl;
			trackingPixel.classList.add('pixel-tracking');

			parentElement.insertBefore(newLogoAnchorElement, logo);
			parentElement.removeChild(logo);
			parentElement.appendChild(trackingPixel);
			newLogoAnchorElement.appendChild(newLogo);
		}

		this.adSlot.emitEvent(events.LOGO_REPLACED);
	}
}
