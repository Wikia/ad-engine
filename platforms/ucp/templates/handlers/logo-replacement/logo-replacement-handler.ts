import { AdSlot, events, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { LogoReplacementParams } from './logo-replacement-params';

@Injectable({ autobind: false })
export class LogoReplacementHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: LogoReplacementParams,
	) {}

	async onEnter(): Promise<void> {
		const parentElement = document.querySelector('.wds-global-navigation__content-bar-left');
		const fandomLogo = document.querySelector('.wds-global-navigation__logo');

		setTimeout(() => {
			if (parentElement && fandomLogo) {
				const newLogoAnchorElement = document.createElement('a');
				newLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.fandom.com/';

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
		}, 1000);
	}

	async onLeave(): Promise<void> {}
}
