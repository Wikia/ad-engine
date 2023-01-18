import { LogoReplacementParams } from '@platforms/shared';
import { TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2Environment, F2_ENV } from '../../../setup-f2';

@Injectable({ autobind: false })
export class LogoReplacementF2Handler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: LogoReplacementParams,
		@Inject(F2_ENV) private f2Env: F2Environment,
	) {}

	async onEnter(): Promise<void> {
		const isMobile = this.f2Env.isPageMobile;
		const parentElementSelector = isMobile
			? '.global-navigation-mobile__content-bar'
			: '.wds-global-navigation__content-bar';
		const fandomLogoSelector = isMobile
			? '.global-navigation-mobile__logo'
			: '.wds-global-navigation__logo';
		const parentElement = document.querySelector(parentElementSelector);
		const fandomLogo = document.querySelector(fandomLogoSelector);
		const logoClass = isMobile ? 'global-navigation-mobile__logo' : 'wds-global-navigation__logo';

		if (parentElement && fandomLogo) {
			const customLogoAnchorElement = document.createElement('a');
			customLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.fandom.com/';
			customLogoAnchorElement.classList.add(logoClass);

			const customLogo = document.createElement('img');
			customLogo.src = this.params.logoImage;
			customLogo.classList.add('custom-logo');

			const trackingPixel = document.createElement('img');
			trackingPixel.src = this.params.pixelUrl;
			trackingPixel.classList.add('tracking-pixel');

			parentElement.insertBefore(customLogoAnchorElement, fandomLogo);
			parentElement.removeChild(fandomLogo);
			parentElement.appendChild(trackingPixel);

			if (this.params.smallSizedLogoImage) {
				const smallCustomLogo = document.createElement('img');
				smallCustomLogo.src = this.params.smallSizedLogoImage;
				smallCustomLogo.classList.add('small-custom-logo');
				customLogoAnchorElement.appendChild(smallCustomLogo);
			}

			customLogoAnchorElement.appendChild(customLogo);
		}
	}
}
