export const getLogoReplacementConfig = () => ({
	replaceLogo: (logoImage, pixelUrl, clickThroughUrl) => {
		const parentElement = document.querySelector('.header__container');
		const logo = document.querySelector('.header__home-link');

		if (parentElement && logo) {
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = clickThroughUrl;

			const newLogo = document.createElement('img');
			newLogo.src = logoImage;
			newLogo.style.maxHeight = '48px';

			const trackingPixel = document.createElement('img');
			trackingPixel.src = pixelUrl;
			trackingPixel.style.display = 'none';

			parentElement.insertBefore(newLogoAnchorElement, logo);
			parentElement.removeChild(logo);
			parentElement.appendChild(trackingPixel);
			newLogoAnchorElement.appendChild(newLogo);
		}
	},
});
