import { utils } from '@ad-engine/core';

export interface LogoReplacementTemplateConfig {
	logoImage: string;
	clickThroughUrl: string;
}

export class LogoReplacement {
	static getName(): string {
		return 'logoReplacement';
	}

	static getDefaultConfig(): object {
		return {};
	}

	init(params: LogoReplacementTemplateConfig): void {
		utils.logger(LogoReplacement.getName(), 'init');

		this.replaceLogo(params);
	}

	private replaceLogo(params: LogoReplacementTemplateConfig): void {
		const parentElement = document.querySelector('.wds-global-navigation__content-bar-left');
		const fandomLogo = document.querySelector('.wds-global-navigation__logo');

		if (parentElement && fandomLogo) {
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = params.clickThroughUrl;

			const newLogo = document.createElement('img');
			newLogo.src = params.logoImage;

			parentElement.insertBefore(newLogoAnchorElement, fandomLogo);
			parentElement.removeChild(fandomLogo);
			newLogoAnchorElement.appendChild(newLogo);
		}
	}
}
