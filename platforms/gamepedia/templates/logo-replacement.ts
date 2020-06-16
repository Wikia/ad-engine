import { AdSlot, context, events, utils } from '@wikia/ad-engine';

export interface LogoReplacementTemplateConfig {
	logoImage: string;
	clickThroughUrl: string;
	pixelUrl: string;
	replaceLogo: () => void;
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
		const parentElement = document.querySelector('.netbar-flex');
		const gamepediaLogo = document.querySelector('#netbar .netbar-box.logo');

		if (parentElement && gamepediaLogo) {
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = this.config.clickThroughUrl || 'https://www.gamepedia.com/';
			newLogoAnchorElement.classList.add('netbar-box', 'left');

			const newLogo = document.createElement('img');
			newLogo.src = this.config.logoImage;
			newLogo.classList.add('new-logo');

			const trackingPixel = document.createElement('img');
			trackingPixel.src = this.config.pixelUrl;
			trackingPixel.classList.add('pixel-tracking');

			parentElement.insertBefore(newLogoAnchorElement, gamepediaLogo);
			parentElement.removeChild(gamepediaLogo);
			parentElement.appendChild(trackingPixel);
			newLogoAnchorElement.appendChild(newLogo);

			this.adSlot.emitEvent(events.LOGO_REPLACED);
		}
	}
}
