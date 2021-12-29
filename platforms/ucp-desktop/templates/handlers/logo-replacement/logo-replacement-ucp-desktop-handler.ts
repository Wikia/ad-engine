import { LogoReplacementParams } from '@platforms/shared';
import { TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class LogoReplacementUcpDesktopHandler implements TemplateStateHandler {
	constructor(@Inject(TEMPLATE.PARAMS) private params: LogoReplacementParams) {}

	async onEnter(): Promise<void> {
		const parentElement = document.querySelector('.wds-global-navigation__content-bar-left');
		const fandomLogo = document.querySelector('.wds-global-navigation__logo');

		setTimeout(() => {
			if (parentElement && fandomLogo) {
				const customLogoAnchorElement = document.createElement('a');
				customLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.fandom.com/';

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
		}, 1000);
	}
}
