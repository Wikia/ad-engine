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
		const parentElement = document.querySelector('.netbar-flex');
		const gamepediaLogo = document.querySelector('#netbar .netbar-box.logo');

		setTimeout(() => {
			if (parentElement && gamepediaLogo) {
				const newLogoAnchorElement = document.createElement('a');
				newLogoAnchorElement.href = this.params.clickThroughUrl || 'https://www.gamepedia.com/';
				newLogoAnchorElement.classList.add('netbar-box', 'left');

				const newLogo = document.createElement('img');
				newLogo.src = this.params.logoImage;
				newLogo.classList.add('new-logo');

				const trackingPixel = document.createElement('img');
				trackingPixel.src = this.params.pixelUrl;
				trackingPixel.classList.add('pixel-tracking');

				parentElement.insertBefore(newLogoAnchorElement, gamepediaLogo);
				parentElement.removeChild(gamepediaLogo);
				parentElement.appendChild(trackingPixel);
				newLogoAnchorElement.appendChild(newLogo);

				this.adSlot.emitEvent(events.LOGO_REPLACED);
			}
		}, 1000);
	}

	async onLeave(): Promise<void> {}
}
