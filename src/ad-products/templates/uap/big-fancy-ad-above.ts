import { context, utils } from '@wikia/ad-engine';
import { navbarManager } from '../../utils';
import { CSS_TIMING_EASE_IN_CUBIC, SLIDE_OUT_TIME } from './constants';
import { bfaThemeFactory } from './themes/factory';
import { universalAdPackage } from './universal-ad-package';
import { VideoSettings } from './video-settings';

export class BigFancyAdAbove {
	static getName() {
		return 'bfaa';
	}

	static getDefaultConfig() {
		return {
			desktopNavbarWrapperSelector: '.wds-global-navigation-wrapper',
			mobileNavbarWrapperSelector: '.global-navigation-mobile-wrapper',
			mainContainer: document.body,
			handleNavbar: false,
			autoPlayAllowed: true,
			defaultStateAllowed: true,
			fullscreenAllowed: true,
			stickinessAllowed: true,
			slotSibling: '.topic-header',
			slotsToEnable: ['bottom_leaderboard', 'incontent_boxad', 'top_boxad'],
			onInit: () => {},
			onBeforeStickBfaaCallback: () => {},
			onAfterStickBfaaCallback: () => {},
			onBeforeUnstickBfaaCallback: () => {},
			onAfterUnstickBfaaCallback: () => {},
			moveNavbar(offset, time = SLIDE_OUT_TIME) {
				const navbarElement = document.querySelector('body > nav.navigation');

				if (navbarElement) {
					navbarElement.style.transition = offset
						? ''
						: `top ${time}ms ${CSS_TIMING_EASE_IN_CUBIC}`;
					navbarElement.style.top = offset ? `${offset}px` : '';
				}
			},
		};
	}

	/**
	 * Constructor
	 *
	 * @param {object} adSlot
	 */
	constructor(adSlot) {
		this.adSlot = adSlot;
		this.config = context.get('templates.bfaa') || {};
		this.container = document.getElementById(this.adSlot.getSlotName());
		this.videoSettings = null;
		this.theme = null;
	}

	/**
	 * Initializes the BFAA unit
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

		universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);
		this.videoSettings = new VideoSettings(this.params);
		this.container.style.backgroundColor = this.getBackgroundColor();
		this.container.classList.add('bfaa-template');
		this.theme = bfaThemeFactory.makeAboveTheme(this.adSlot, this.params);

		this.theme.adIsReady(this.videoSettings).then((iframe) => this.onAdReady(iframe));

		this.config.onInit(this.adSlot, this.params, this.config);
	}

	getBackgroundColor() {
		const color = `#${this.params.backgroundColor.replace('#', '')}`;

		return this.params.backgroundColor ? color : '#000';
	}

	async onAdReady(iframe) {
		this.config.mainContainer.style.paddingTop = iframe.parentElement.style.paddingBottom;
		this.config.mainContainer.classList.add('has-bfaa');

		navbarManager.setup(this.config, this.container);

		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}

		this.theme.onAdReady();

		if (universalAdPackage.isVideoEnabled(this.params)) {
			// defers for proper rendering
			const video = await utils.defer(universalAdPackage.loadVideoAd, this.videoSettings);

			this.theme.onVideoReady(video);
		} else if (this.params.channelName) {
			// defers for proper rendering
			await utils.defer(universalAdPackage.loadTwitchAd, iframe, this.params);
		}
	}
}
