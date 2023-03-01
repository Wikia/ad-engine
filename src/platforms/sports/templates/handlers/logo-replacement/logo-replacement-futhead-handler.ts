import { LogoReplacementParams } from '@platforms/shared';
import { TargetingData, targetingService, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class LogoReplacementFutheadHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: LogoReplacementParams) {}

	async onEnter(): Promise<void> {
		const parentElement = document.querySelector('.dropdown.dropdown-hover');
		const logo = document.querySelector('.navbar-brand.navbar-brand-lg');
		const isDesktop = targetingService.dump<TargetingData>().skin.includes('desktop');

		setTimeout(() => {
			if (isDesktop && parentElement && logo) {
				if (isDesktop && parentElement && logo) {
					const customLogoAnchorElement = document.createElement('a');
					customLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.futhead.com/';
					customLogoAnchorElement.style.padding = '0 15px';

					const customLogo = document.createElement('img');
					customLogo.src = this.params.logoImage;
					customLogo.classList.add('custom-logo');

					const trackingPixel = document.createElement('img');
					trackingPixel.src = this.params.pixelUrl;
					trackingPixel.classList.add('pixel-tracking');

					parentElement.insertBefore(customLogoAnchorElement, logo);
					parentElement.removeChild(logo);
					parentElement.appendChild(trackingPixel);
					customLogoAnchorElement.appendChild(customLogo);
				}
			}
		}, 1000);
	}
}
