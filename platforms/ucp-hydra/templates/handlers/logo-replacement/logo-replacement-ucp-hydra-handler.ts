import { LogoReplacementParams } from '@platforms/shared';
import { AdSlot, events, TEMPLATE, TemplateStateHandler } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class LogoReplacementUcpHydraHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: LogoReplacementParams,
	) {}

	async onEnter(): Promise<void> {
		const parentElement = document.querySelector('.netbar-flex');
		const gamepediaLogo = document.querySelector('#netbar .netbar-box.logo');

		setTimeout(() => {
			if (parentElement && gamepediaLogo) {
				const customLogoAnchorElement = document.createElement('a');
				customLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.gamepedia.com/';
				customLogoAnchorElement.classList.add('netbar-box', 'left');

				const customLogo = document.createElement('img');
				customLogo.src = this.params.logoImage;
				customLogo.classList.add('custom-logo');

				const smallCustomLogo = document.createElement('img');
				smallCustomLogo.src = this.params.smallSizedLogoImage;
				smallCustomLogo.classList.add('small-custom-logo');

				const trackingPixel = document.createElement('img');
				trackingPixel.src = this.params.pixelUrl;
				trackingPixel.classList.add('pixel-tracking');

				parentElement.insertBefore(customLogoAnchorElement, gamepediaLogo);
				parentElement.removeChild(gamepediaLogo);
				parentElement.appendChild(trackingPixel);
				customLogoAnchorElement.appendChild(smallCustomLogo);
				customLogoAnchorElement.appendChild(customLogo);

				this.adSlot.emitEvent(events.LOGO_REPLACED);
			}
		}, 1000);
	}
}
