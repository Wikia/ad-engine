export const getLogoReplacementConfig = () => ({
	replaceLogo: (logoImage, pixelUrl, clickThroughUrl) => {
		const parentElement = document.querySelector('.dropdown.dropdown-hover');
		const logo = document.querySelector('.navbar-brand.navbar-brand-lg');

		if (parentElement && logo) {
			const newLogoAnchorElement = document.createElement('a');
			newLogoAnchorElement.href = clickThroughUrl;
			newLogoAnchorElement.style.padding = '0 15px';

			const newLogo = document.createElement('img');
			newLogo.src = logoImage;
			newLogo.style.maxHeight = '40px';

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
