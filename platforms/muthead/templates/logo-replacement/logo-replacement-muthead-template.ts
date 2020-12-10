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

		setTimeout(() => {
			this.replaceLogo();
		}, 1000);
	}

	replaceLogo(): void {
		const parentElement = document.querySelector('.header__container');
		const logo = document.querySelector('.header__home-link');
		const isDesktop = context.get('targeting.skin').includes('desktop');

		if (isDesktop && parentElement && logo) {
			const customLogoAnchorElement = document.createElement('a');
			customLogoAnchorElement.href = this.config.clickThroughUrl || 'https://www.muthead.com/';

			const customLogo = document.createElement('img');
			customLogo.src = this.config.logoImage;
			customLogo.classList.add('custom-logo');

			const trackingPixel = document.createElement('img');
			trackingPixel.src = this.config.pixelUrl;
			trackingPixel.classList.add('pixel-tracking');

			parentElement.insertBefore(customLogoAnchorElement, logo);
			parentElement.removeChild(logo);
			parentElement.appendChild(trackingPixel);
			customLogoAnchorElement.appendChild(customLogo);
		}

		this.adSlot.emitEvent(events.LOGO_REPLACED);
	}
}
