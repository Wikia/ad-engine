import { AdSlot, context, utils } from '@wikia/ad-engine';
import { navbarManager } from '../../utils';
import { CSS_TIMING_EASE_IN_CUBIC, SLIDE_OUT_TIME } from './constants';
import { BfaaTheme } from './themes/classic';
import { bfaThemeFactory } from './themes/factory';
import { BfaaHiviTheme } from './themes/hivi';
import { UapParams, universalAdPackage } from './universal-ad-package';
import { VideoSettings } from './video-settings';

export type StickinessCallback = (
	config: BigFancyAdAboveConfig,
	adSlot: AdSlot,
	params: UapParams,
) => void;

export interface BigFancyAdAboveConfig {
	desktopNavbarWrapperSelector: string;
	mobileNavbarWrapperSelector: string;
	mainContainer: HTMLElement;
	handleNavbar: boolean;
	autoPlayAllowed: boolean;
	defaultStateAllowed: boolean;
	fullscreenAllowed: boolean;
	stickinessAllowed: boolean;
	slotSibling: string;
	slotsToEnable: string[];
	slotsToDisable?: string[];
	onInit: (adSlot: AdSlot, params: UapParams, config: BigFancyAdAboveConfig) => void;
	onBeforeStickBfaaCallback: StickinessCallback;
	onAfterStickBfaaCallback: StickinessCallback;
	onBeforeUnstickBfaaCallback: StickinessCallback;
	onAfterUnstickBfaaCallback: StickinessCallback;
	moveNavbar: (offset: number, time: number) => void;
}

export class BigFancyAdAbove {
	static getName(): string {
		return 'bfaa';
	}

	static getDefaultConfig(): BigFancyAdAboveConfig {
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
			moveNavbar(offset: number, time: number = SLIDE_OUT_TIME) {
				const navbarElement: HTMLElement = document.querySelector('body > nav.navigation');

				if (navbarElement) {
					navbarElement.style.transition = offset
						? ''
						: `top ${time}ms ${CSS_TIMING_EASE_IN_CUBIC}`;
					navbarElement.style.top = offset ? `${offset}px` : '';
				}
			},
		};
	}

	config: BigFancyAdAboveConfig;
	container: HTMLElement;
	videoSettings: VideoSettings = null;
	theme: BfaaTheme | BfaaHiviTheme = null;
	params: UapParams;

	constructor(private adSlot: AdSlot) {
		this.config = context.get('templates.bfaa') || {};
		this.container = document.getElementById(this.adSlot.getSlotName());
	}

	/**
	 * Initializes the BFAA unit
	 */
	init(params: UapParams): void {
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

	getBackgroundColor(): string {
		const color = `#${this.params.backgroundColor.replace('#', '')}`;

		return this.params.backgroundColor ? color : '#000';
	}

	async onAdReady(iframe: HTMLIFrameElement): Promise<void> {
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
