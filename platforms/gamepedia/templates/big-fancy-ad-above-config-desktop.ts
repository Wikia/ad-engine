import {
	AdSlot,
	BigFancyAdAboveConfig,
	context,
	NavbarManager,
	slotTweaker,
	UapParams,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { editModeManager } from '../utils/edit-mode-manager';

const { CSS_TIMING_EASE_IN_CUBIC, FADE_IN_TIME, SLIDE_OUT_TIME } = universalAdPackage;
const navbarBorderSize = 1;

export function getBfaaConfigDesktop(): any {
	return {
		autoPlayAllowed: true,
		defaultStateAllowed: true,
		fullscreenAllowed: true,
		globalSuggestionsElement: null,
		stickinessAllowed: true,
		adSlot: null,
		templateParams: null,
		slotsToDisable: [
			'cdm-zone-02',
			'cdm-zone-03',
			'cdm-zone-04',
			'cdm-zone-06',
			'incontent_player',
		],
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

				editModeManager.onActivate(() => {
					this.enabled = false;
					this.adSlot.destroy();
					this.adjustPageMargin();
				});
			});
		},

		onAfterStickBfaaCallback(): void {
			this.removeSlotMargin();
		},

		onBeforeUnstickBfaaCallback(): void {
			Object.assign(this.navbarElement.style, {
				transition:
					`top ${SLIDE_OUT_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}, ` +
					`opacity ${FADE_IN_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}`,
				top: '0',
				opacity: '0',
			});
		},

		onAfterUnstickBfaaCallback(): void {
			if (this.navbarElement) {
				this.navbarElement.style.position = 'absolute';
			}

			Object.assign(this.navbarElement.style, {
				top: '',
				opacity: '1',
			});

			this.navbarManager.setPinned(false);
			this.adjustSlotMargin(true);
		},

		onResolvedStateSetCallback(): void {
			this.adjustPageMargin(true);
			this.adjustSlotMargin(true);
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
				`calc(${100 / aspectRatio}% + ${this.navbarManager.getHeight() - navbarBorderSize}px)`,
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

		adjustSlotMargin(resolved: boolean): void {
			this.enabled ? this.setSlotMargin(resolved) : this.removeSlotMargin();
		},

		setSlotMargin(resolved: boolean): void {
			const aspectRatio = this.getSlotRatio(resolved);
			const container: HTMLElement = this.adSlot.getElement();

			const { left } = utils.getElementOffset(container);
			const currentMarginTop: number = parseInt(container.style.marginTop, 10) || 0;
			const currentMarginLeft: number = parseInt(container.style.marginLeft, 10) || 0;
			const navbarPosition = this.navbarManager.getHeight() - navbarBorderSize + currentMarginTop;

			container.style.setProperty(
				'margin-top',
				`calc(-${100 / aspectRatio}% - ${navbarPosition}px)`,
				'important',
			);
			container.style.setProperty('margin-left', `${currentMarginLeft - left}px`, 'important');
			container.style.setProperty('width', '100vw', 'important');
		},

		removeSlotMargin(): void {
			const container = this.adSlot.getElement();

			container.style.removeProperty('margin-top');
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
