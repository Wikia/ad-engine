import { LogoReplacementParams } from '@platforms/shared';
import { AdSlot, events, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class LogoReplacementUcpMobileHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: LogoReplacementParams,
	) {}

	async onEnter(): Promise<void> {
		const fandomLogo = document.querySelector('.wds-global-navigation__logo');
		const fandomLogoParent = document.querySelector('.wds-global-navigation__content-bar-left');
		const fandomHeart = document.querySelector('.wds-global-navigation__logo-heart-link');
		const fandomHeartParent = document.querySelector('.wds-global-navigation__community-bar');
		const separator = document.querySelector('.wds-global-navigation__community-bar-separator');
		const separatorParent = document.querySelector('.wds-global-navigation__community-bar');

		if (fandomLogoParent && fandomLogo && separatorParent && separator) {
			setTimeout(() => {
				const newLogoAnchorElement = document.createElement('a');
				newLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.fandom.com/';

				const newLogo = document.createElement('img');
				newLogo.src = this.params.logoImage;
				newLogo.classList.add('new-logo');

				const trackingPixel = document.createElement('img');
				trackingPixel.src = this.params.pixelUrl;
				trackingPixel.classList.add('tracking-pixel');

				separatorParent.insertBefore(newLogoAnchorElement, separator);
				fandomLogoParent.removeChild(fandomLogo);
				fandomLogoParent.appendChild(trackingPixel);
				newLogoAnchorElement.appendChild(newLogo);

				if (fandomHeartParent && fandomHeart) {
					fandomHeartParent.removeChild(fandomHeart);
				}

				this.adSlot.emitEvent(events.LOGO_REPLACED);
			}, 1000);
		}
	}
}
