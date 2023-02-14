import { LogoReplacementParams } from '@platforms/shared';
import { TargetingData, targetingService, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class LogoReplacementMutheadHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.PARAMS) private params: LogoReplacementParams) {}

	async onEnter(): Promise<void> {
		const parentElement = document.querySelector('.header__container');
		const logo = document.querySelector('.header__home-link');
		const isDesktop = targetingService.dump<TargetingData>().skin.includes('desktop');

		setTimeout(() => {
			if (isDesktop && parentElement && logo) {
				const customLogoAnchorElement = document.createElement('a');
				customLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.muthead.com/';

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
		}, 1000);
	}
}
