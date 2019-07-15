import { context } from '@ad-engine/core';

export class Skin {
	static getName() {
		return 'skin';
	}

	static getDefaultConfig() {
		return {
			bodyAdClass: 'has-background-ad',
			onInit: () => {},
			wrapperSelector: '#ad-skin',
			zIndex: 1,
		};
	}

	constructor() {
		this.config = context.get('templates.skin') || {};
		this.adSkin = document.querySelector(this.config.wrapperSelector);
	}

	/**
	 * Initializes the Skin unit
	 *
	 * @param {Object} params
	 * @param {string} params.destUrl - URL to go when the background is clicked
	 * @param {string} params.skinImage - URL of the 1700x800 image to show in the background
	 * @param {string} params.backgroundColor - background color to use (rrggbb, without leading #)
	 * @param {string} [params.middleColor] - color to use in the middle (rrggbb, without leading #)
	 * @param {Array} params.pixels - URLs of tracking pixels to append when showing the skin
	 */
	init(params) {
		this.params = params;
		this.params.adProduct = 'skin';

		document.body.classList.add(this.config.bodyAdClass);
		this.setAdSkinStyle(params.skinImage, params.backgroundColor);

		this.adSkin.onclick = function () {
			window.open(params.destUrl);
		};

		if (params.pixels) {
			this.setTrackingPixels(params.pixels);
		}

		this.adSkin.classList.remove('hide');

		this.config.onInit(this.params);
	}

	/**
	 * Sets styles for ad skin wrapper
	 *
	 * @param params
	 */
	setAdSkinStyle(image, color) {
		this.adSkin.style.position = 'fixed';
		this.adSkin.style.height = '100%';
		this.adSkin.style.width = '100%';
		this.adSkin.style.left = 0;
		this.adSkin.style.top = 0;
		this.adSkin.style.zIndex = this.config.zIndex;
		this.adSkin.style.cursor = 'pointer';
		this.adSkin.style.background = `url("${image}") no-repeat top center #${color}`;
	}

	/**
	 * Goes through pixels array and adds 1x1 pixel images
	 *
	 * @param pixels
	 */
	setTrackingPixels(pixels) {
		for (let i = 0, len = pixels.length; i < len; i += 1) {
			const pixelUrl = pixels[i];

			if (pixelUrl) {
				const pixelElement = document.createElement('img');

				pixelElement.src = pixelUrl;
				pixelElement.width = 1;
				pixelElement.height = 1;
				this.adSkin.appendChild(pixelElement);
			}
		}
	}
}
