import { LogoReplacementParams } from '@platforms/shared';
import { AdSlot, context, events, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class LogoReplacementFutheadHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: LogoReplacementParams,
	) {}

	async onEnter(): Promise<void> {
		const parentElement = document.querySelector('.dropdown.dropdown-hover');
		const logo = document.querySelector('.navbar-brand.navbar-brand-lg');
		const isDesktop = context.get('targeting.skin').includes('desktop');

		setTimeout(() => {
			if (isDesktop && parentElement && logo) {
				if (isDesktop && parentElement && logo) {
					const newLogoAnchorElement = document.createElement('a');
					newLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.futhead.com/';
					newLogoAnchorElement.style.padding = '0 15px';

					const newLogo = document.createElement('img');
					newLogo.src = this.params.logoImage;
					newLogo.classList.add('new-logo');

					const trackingPixel = document.createElement('img');
					trackingPixel.src = this.params.pixelUrl;
					trackingPixel.classList.add('pixel-tracking');

					parentElement.insertBefore(newLogoAnchorElement, logo);
					parentElement.removeChild(logo);
					parentElement.appendChild(trackingPixel);
					newLogoAnchorElement.appendChild(newLogo);
				}

				this.adSlot.emitEvent(events.LOGO_REPLACED);
			}
		}, 1000);
	}

	async onLeave(): Promise<void> {}
}
