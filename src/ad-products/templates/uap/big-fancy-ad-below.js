import { context, utils } from '@wikia/ad-engine';
import { universalAdPackage } from './universal-ad-package';
import { VideoSettings } from './video-settings';
import { bfaThemeFactory } from './themes/factory';

export class BigFancyAdBelow {
	static getName() {
		return 'bfab';
	}

	static getDefaultConfig() {
		return {
			autoPlayAllowed: true,
			defaultStateAllowed: true,
			fullscreenAllowed: true,
			stickinessAllowed: false,
			bfaaSlotName: 'top_leaderboard',
			unstickInstantlyBelowPosition: 500,
			topThreshold: 58,
			onInit: () => {},
		};
	}

	/**
	 * Constructor
	 *
	 * @param {object} adSlot
	 */
	constructor(adSlot) {
		this.adSlot = adSlot;
		this.config = context.get('templates.bfab');
		this.container = document.getElementById(this.adSlot.getSlotName());
		this.theme = null;
		this.videoSettings = null;
	}

	/**
	 * Initializes the BFAB unit
	 */
	init(params) {
		this.params = params;

		if (!this.container) {
			return;
		}

		// TODO Remove this hack when all mobile apps support autoplay and fullscreen
		if (!this.config.autoPlayAllowed) {
			this.params.autoPlay = false;
			this.params.resolvedStateAutoPlay = false;
		}
		this.params.fullscreenAllowed = this.config.fullscreenAllowed;
		// TODO: End of hack

		universalAdPackage.initSlot(params);

		this.container.classList.add('bfab-template');
		this.videoSettings = new VideoSettings(params);
		this.theme = bfaThemeFactory.makeBelowTheme(this.adSlot, this.params);

		this.theme.adIsReady(this.videoSettings).then((iframe) => this.onAdReady(iframe));

		this.config.onInit(this.adSlot, this.params, this.config);
	}

	async onAdReady(iframe) {
		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}

		this.theme.onAdReady(iframe);

		if (universalAdPackage.isVideoEnabled(this.params)) {
			const video = await utils.defer(universalAdPackage.loadVideoAd, this.videoSettings);

			this.theme.onVideoReady(video);
		}
	}
}
