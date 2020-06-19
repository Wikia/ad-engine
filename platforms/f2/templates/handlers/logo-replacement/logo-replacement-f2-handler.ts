import { LogoReplacementParams } from '@platforms/shared';
import { AdSlot, events, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_ENV, F2Environment } from '../../../setup-f2';

@Injectable({ autobind: false })
export class LogoReplacementF2Handler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
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
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.fandom.com/';
			newLogoAnchorElement.classList.add(logoClass);

			const newLogo = document.createElement('img');
			newLogo.src = this.params.logoImage;
			newLogo.classList.add('new-logo');

			const trackingPixel = document.createElement('img');
			trackingPixel.src = this.params.pixelUrl;
			trackingPixel.classList.add('tracking-pixel');

			parentElement.insertBefore(newLogoAnchorElement, fandomLogo);
			parentElement.removeChild(fandomLogo);
			parentElement.appendChild(trackingPixel);
			newLogoAnchorElement.appendChild(newLogo);

			this.adSlot.emitEvent(events.LOGO_REPLACED);
		}
	}

	async onLeave(): Promise<void> {}
}
