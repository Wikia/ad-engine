export const getLogoReplacementConfig = () => ({
	replaceLogo: (logoImage, pixelUrl, clickThroughUrl) => {
		const parentElement = document.querySelector('.netbar-flex');
		const gamepediaLogo = document.querySelector('#netbar .netbar-box.logo');

		if (parentElement && gamepediaLogo) {
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = clickThroughUrl;

			const newLogo = document.createElement('img');
			newLogo.src = logoImage;
			newLogo.style.maxHeight = '30px';

			const trackingPixel = document.createElement('img');
			trackingPixel.src = pixelUrl;
			trackingPixel.style.display = 'none';

			parentElement.insertBefore(newLogoAnchorElement, gamepediaLogo);
			parentElement.removeChild(gamepediaLogo);
			parentElement.appendChild(trackingPixel);
			newLogoAnchorElement.appendChild(newLogo);
		}
	},
});
