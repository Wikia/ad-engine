import { LogoReplacementParams } from '@platforms/shared';
import { TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';

@injectable()
export class LogoReplacementUcpMobileHandler implements TemplateStateHandler {
	constructor(@inject(TEMPLATE.PARAMS) private params: LogoReplacementParams) {}

	async onEnter(): Promise<void> {
		const fandomLogo = document.querySelector('.mobile-global-navigation__logo');
		const fandomLogoParent = document.querySelector('.mobile-global-navigation__left');
		const fandomHeart = document.querySelector('.mobile-global-navigation__logomark');
		const separator = document.querySelector('.mobile-global-navigation__community-bar-separator');
		const fandomHeartSeparatorParent = document.querySelector(
			'.mobile-global-navigation__community-bar',
		);

		if (fandomLogoParent && fandomLogo && fandomHeartSeparatorParent && separator) {
			setTimeout(() => {
				const customLogoAnchorElement = document.createElement('a');
				customLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.fandom.com/';

				const customLogo = document.createElement('img');
				customLogo.src = this.params.logoImage;
				customLogo.classList.add('custom-logo');

				const trackingPixel = document.createElement('img');
				trackingPixel.src = this.params.pixelUrl;
				trackingPixel.classList.add('tracking-pixel');

				fandomHeartSeparatorParent.insertBefore(customLogoAnchorElement, separator);
				fandomLogoParent.removeChild(fandomLogo);
				fandomLogoParent.appendChild(trackingPixel);

				if (this.params.smallSizedLogoImage) {
					const smallCustomLogo = document.createElement('img');
					smallCustomLogo.src = this.params.smallSizedLogoImage;
					smallCustomLogo.classList.add('small-custom-logo');
					customLogoAnchorElement.appendChild(smallCustomLogo);
				}

				customLogoAnchorElement.appendChild(customLogo);

				if (fandomHeart) {
					fandomHeartSeparatorParent.removeChild(fandomHeart);
				}
			}, 1000);
		}
	}
}
