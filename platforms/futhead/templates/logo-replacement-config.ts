import { events } from '@wikia/ad-engine';

export const getLogoReplacementConfig = () => ({
	parentSelector: '.dropdown.dropdown-hover',
	logoSelector: '.navbar-brand.navbar-brand-lg',
	replaceLogo(config, adSlot): void {
		const parentElement = document.querySelector(config.parentSelector);
		const logo = document.querySelector(config.logoSelector);

		if (parentElement && logo) {
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = config.clickThroughUrl || 'https://www.fandom.com/';
			newLogoAnchorElement.style.padding = '0 15px';

			const newLogo = document.createElement('img');
			newLogo.src = config.logoImage;
			newLogo.classList.add('new-logo');

			const trackingPixel = document.createElement('img');
			trackingPixel.src = config.pixelUrl;
			trackingPixel.classList.add('pixel-tracking');

			parentElement.insertBefore(newLogoAnchorElement, logo);
			parentElement.removeChild(logo);
			parentElement.appendChild(trackingPixel);
			newLogoAnchorElement.appendChild(newLogo);
		}

		adSlot.emitEvent(events.LOGO_REPLACED);
	},
});
