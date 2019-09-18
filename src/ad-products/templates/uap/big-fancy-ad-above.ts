import { AdSlot, context, utils } from '@ad-engine/core';
import { NavbarManager, setupNavbar } from '../../utils';
import { bfaThemeFactory } from './themes/factory';
import { BigFancyAdTheme } from './themes/theme';
import { UapVideoSettings } from './uap-video-settings';
import { UapParams, universalAdPackage } from './universal-ad-package';

export type StickinessCallback = (
	config: BigFancyAdAboveConfig,
	adSlot: AdSlot,
	params: UapParams,
) => void;

export interface BigFancyAdAboveConfig {
	adSlot?: AdSlot;
	desktopNavbarWrapperSelector?: string;
	mobileNavbarWrapperSelector?: string;
	mainContainer?: HTMLElement;
	navbarManager?: NavbarManager;
	navbarScrollListener?: string;
	handleNavbar?: boolean;
	autoPlayAllowed?: boolean;
	defaultStateAllowed?: boolean;
	fullscreenAllowed?: boolean;
	stickinessAllowed?: boolean;
	stickyUntilSlotViewed?: boolean;
	slotSibling?: string;
	slotsToEnable?: string[];
	slotsToDisable?: string[];
	onInit: (adSlot: AdSlot, params: UapParams, config: BigFancyAdAboveConfig) => void;
	onBeforeStickBfaaCallback?: StickinessCallback;
	onAfterStickBfaaCallback?: StickinessCallback;
	onBeforeUnstickBfaaCallback?: StickinessCallback;
	onAfterUnstickBfaaCallback?: StickinessCallback;
	onResolvedStateSetCallback?: StickinessCallback;
	onResolvedStateResetCallback?: StickinessCallback;
	moveNavbar?: (offset: number, time: number) => void;
	updateNavbar?: () => void;
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
			stickyUntilSlotViewed: true,
			slotSibling: '.topic-header',
			slotsToEnable: ['bottom_leaderboard', 'incontent_boxad', 'top_boxad'],
			onInit: () => {},
			onBeforeStickBfaaCallback: () => {},
			onAfterStickBfaaCallback: () => {},
			onBeforeUnstickBfaaCallback: () => {},
			onAfterUnstickBfaaCallback() {},
			onResolvedStateSetCallback: () => {},
			onResolvedStateResetCallback: () => {},
			moveNavbar() {},
		};
	}

	private config: BigFancyAdAboveConfig;
	private container: HTMLElement;
	private videoSettings: UapVideoSettings;
	private theme: BigFancyAdTheme;
	private params: UapParams;

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

		this.adSlot.setConfigProperty('showManually', true);
		this.adSlot.hide();

		// TODO Remove this hack when all mobile apps support autoplay and fullscreen
		if (!this.config.autoPlayAllowed) {
			this.params.autoPlay = false;
			this.params.resolvedStateAutoPlay = false;
		}
		this.params.fullscreenAllowed = this.config.fullscreenAllowed;
		// TODO: End of hack

		universalAdPackage.init(this.params, this.config.slotsToEnable, this.config.slotsToDisable);
		this.videoSettings = new UapVideoSettings(this.params);
		this.container.style.backgroundColor = this.getBackgroundColor();
		this.container.classList.add('bfaa-template');
		this.theme = bfaThemeFactory.makeAboveTheme(this.adSlot, this.params);

		this.theme
			.adIsReady(this.videoSettings)
			.then((iframe: HTMLIFrameElement) => this.onAdReady(iframe));

		this.config.onInit(this.adSlot, this.params, this.config);
	}

	getBackgroundColor(): string {
		const color = `#${this.params.backgroundColor.replace('#', '')}`;

		return this.params.backgroundColor ? color : '#000';
	}

	async onAdReady(iframe: HTMLIFrameElement): Promise<void> {
		this.config.mainContainer.style.paddingTop = iframe.parentElement.style.paddingBottom;
		this.config.mainContainer.classList.add('has-bfaa');

		// Ad has to be shown after iframe is ready (and slot is expanded to responsive)
		// However it has to be visible before adjusting navbar position...
		this.adSlot.show();

		setupNavbar(this.config, this.container);

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
