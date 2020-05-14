import { utils } from '@ad-engine/core';

export interface LogoReplacementTemplateConfig {
	logoImage: string;
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

		const logoSrc = params.logoImage;
		this.replaceLogo(logoSrc);
	}

	private replaceLogo(logoSrc: string): void {
		const parentElement = document.querySelector(
			'#globalNavigation .wds-global-navigation__content-bar-left',
		);
		const fandomLogo = document.querySelector('.wds-global-navigation__logo');

		if (parentElement && fandomLogo) {
			const newLogo = document.createElement('img');
			newLogo.src = logoSrc;

			parentElement.insertBefore(newLogo, fandomLogo);
			parentElement.removeChild(fandomLogo);
		}
	}
}
