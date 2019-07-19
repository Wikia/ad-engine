import {
	AdSlot,
	BigFancyAdAboveConfig,
	context,
	NavbarManager,
	scrollListener,
	slotTweaker,
	UapParams,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { editModeManager } from '../utils/edit-mode-manager';

const {
	CSS_CLASSNAME_STICKY_BFAA,
	CSS_TIMING_EASE_IN_CUBIC,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} = universalAdPackage;

export function getBfaaConfigDesktop(): any {
	return {
		adjustPageMarginOnScroll: null,
		autoPlayAllowed: true,
		defaultStateAllowed: true,
		fullscreenAllowed: true,
		globalSuggestionsElement: null,
		stickinessAllowed: true,
		adSlot: null,
		templateParams: null,
		updateNavbarOnScroll: null,
		slotsToDisable: ['cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06'],
		navbarElement: null,
		navbarManager: null,
		enabled: true,

		onInit(adSlot: AdSlot, params: UapParams, config: BigFancyAdAboveConfig): void {
			this.enabled = !editModeManager.isInEditMode;
			this.adSlot = adSlot;
			this.templateParams = params;
			this.config = config || context.get('templates.bfaa') || {};
			this.navbarElement = document.getElementById('netbar');
			this.navbarManager = new NavbarManager(this.navbarElement);
			this.globalSuggestionsElement = document.querySelector('body > .suggestions');

			slotTweaker.onReady(adSlot).then(() => {
				this.adjustPageMargin();
				this.adjustPageMarginOnScroll = scrollListener.addCallback(() => this.adjustPageMargin());
				editModeManager.onActivate(() => {
					this.enabled = false;
					this.adSlot.destroy();
					this.adjustPageMargin();
					this.updateNavbar();
				});
			});
		},

		onAfterStickBfaaCallback(): void {
			this.updateNavbar();
			this.updateNavbarOnScroll = scrollListener.addCallback(() => this.updateNavbar());
		},

		onBeforeUnstickBfaaCallback(): void {
			scrollListener.removeCallback(this.adjustPageMarginOnScroll);

			Object.assign(this.navbarElement.style, {
				transition:
					`top ${SLIDE_OUT_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}, ` +
					`opacity ${FADE_IN_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}`,
				top: '0',
				opacity: '0',
			});
		},

		onAfterUnstickBfaaCallback(): void {
			if (this.updateNavbarOnScroll) {
				scrollListener.removeCallback(this.updateNavbarOnScroll);
				this.updateNavbarOnScroll = null;
			}

			if (this.navbarElement) {
				this.navbarElement.style.position = 'absolute';
			}

			Object.assign(this.navbarElement.style, {
				top: '',
				opacity: '1',
			});

			this.navbarManager.setPinned(false);
			this.adjustPageMargin(true);
			this.adjustSlotMargin();
		},

		onResolvedStateSetCallback(): void {
			this.adjustPageMargin(true);
			this.adjustSlotMargin();
		},

		onResolvedStateResetCallback(): void {
			this.adjustPageMargin(false);
			this.removeSlotMargin();
		},

		getSlotRatio(resolved: boolean): number {
			const container = this.adSlot.getElement();
			const isResolved =
				resolved !== undefined ? resolved : container.classList.contains('theme-resolved');

			const aspectRatios = this.templateParams.config.aspectRatio;

			return isResolved ? aspectRatios.resolved : aspectRatios.default;
		},

		adjustPageMargin(resolved: boolean): void {
			const aspectRatio = this.getSlotRatio(resolved);

			this.enabled ? this.setPageMargin(aspectRatio) : this.removePageMargin();
		},

		setPageMargin(aspectRatio: number): void {
			this.config.mainContainer.style.setProperty(
				'margin-top',
				`calc(${100 / aspectRatio}% + ${this.navbarManager.getHeight() - 1}px)`,
				'important',
			);

			// Mediawiki text-box suggestion plugin positions itself relatively to body
			// Because of that we need to adjust top position properly
			// Properties "top" and "margin-top" are used/calculated by plugin
			// Last one we can use is... "transform"
			// https://github.com/wikimedia/mediawiki/blob/1.31.1/resources/src/jquery/jquery.suggestions.js#L279
			if (this.config.globalSuggestionsElement) {
				const height = this.adSlot.getElement().offsetWidth / aspectRatio;

				this.config.globalSuggestionsElement.style.setProperty(
					'transform',
					`translateY(-${height}px)`,
				);
			}
		},

		removePageMargin(): void {
			this.config.mainContainer.style.removeProperty('margin-top');
			this.config.globalSuggestionsElement.style.removeProperty('transform');
		},

		adjustSlotMargin(): void {
			const container = this.adSlot.getElement();
			const isSticky = container.classList.contains(CSS_CLASSNAME_STICKY_BFAA);

			this.enabled ? this.setSlotMargin(isSticky, container) : this.removeSlotMargin();
		},

		setSlotMargin(isSticky: boolean, container: HTMLElement): void {
			if (!isSticky) {
				const { top, left } = utils.getElementOffset(container);

				const currentMarginTop: number = parseInt(container.style.marginTop, 10) || 0;
				const currentMarginLeft: number = parseInt(container.style.marginLeft, 10) || 0;

				container.style.setProperty('margin-top', `${currentMarginTop - top}px`, 'important');
				container.style.setProperty('margin-left', `${currentMarginLeft - left}px`, 'important');
				container.style.setProperty('width', `100vw`, 'important');
			}
		},

		removeSlotMargin(): void {
			const container = this.adSlot.getElement();

			container.style.removeProperty('margin-top');
		},

		updateNavbar(): void {
			const container = this.adSlot.getElement();
			const isResolved = container.classList.contains('theme-resolved');

			if (isResolved) {
				const isSticky = container.classList.contains(CSS_CLASSNAME_STICKY_BFAA);
				const isInViewport = utils.isInViewport(container);

				this.navbarManager.setPinned(isInViewport && isSticky);
				this.moveNavbar(isSticky ? container.offsetHeight : 0);

				scrollListener.removeCallback(this.updateNavbarOnScroll);
				this.updateNavbarOnScroll = null;
			}
		},

		moveNavbar(offset: number): void {
			if (this.navbarElement) {
				if (this.enabled) {
					this.navbarElement.style.position = 'fixed';
					this.navbarElement.style.top = offset ? `${offset}px` : '';
				} else {
					this.navbarElement.style.setProperty('position', null, null);
					this.navbarElement.style.setProperty('top', null, null);
				}
			}
		},
	};
}
