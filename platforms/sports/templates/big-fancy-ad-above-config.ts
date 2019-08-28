import { slotsContext } from '@platforms/shared';
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

const {
	CSS_CLASSNAME_STICKY_BFAA,
	CSS_CLASSNAME_THEME_RESOLVED,
	CSS_TIMING_EASE_IN_CUBIC,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} = universalAdPackage;

export function getBfaaConfig(): BigFancyAdAboveConfig {
	return {
		adSlot: null,
		autoPlayAllowed: true,
		defaultStateAllowed: true,
		fullscreenAllowed: true,
		stickinessAllowed: true,
		slotsToDisable: ['cdm-zone-06', 'incontent_player'],
		slotsToEnable: ['cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04'],
		navbarManager: null,
		navbarScrollListener: null,

		onInit(adSlot: AdSlot, params: UapParams, config: BigFancyAdAboveConfig): void {
			this.adSlot = adSlot;
			this.config = config || context.get('templates.bfaa') || {};
			this.navbarManager = new NavbarManager(document.querySelector('.header'));

			context.set('slots.cdm-zone-04.defaultSizes', [[3, 3]]);
			slotsContext.setupSlotVideoAdUnit(adSlot, params);

			slotTweaker.onReady(adSlot).then(() => {
				this.updateNavbar();
			});

			this.navbarScrollListener = scrollListener.addCallback(() => this.updateNavbar());
		},

		onAfterStickBfaaCallback(): void {
			this.navbarManager.setPinned(false);
		},

		onBeforeUnstickBfaaCallback(): void {
			scrollListener.removeCallback(this.navbarScrollListener);

			this.navbarManager.applyStyles({
				transition:
					`top ${SLIDE_OUT_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}, ` +
					`opacity ${FADE_IN_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}`,
				top: '0',
			});
		},

		onAfterUnstickBfaaCallback(): void {
			this.navbarManager.applyStyles({
				top: '',
			});

			this.updateNavbar();
			this.navbarScrollListener = scrollListener.addCallback(() => this.updateNavbar());
		},

		onResolvedStateSetCallback(): void {
			this.updateNavbar();
		},

		updateNavbar(): void {
			const container = this.adSlot.getElement();
			const isSticky = container.classList.contains(CSS_CLASSNAME_STICKY_BFAA);
			const isInViewport = utils.isInViewport(container, { areaThreshold: 1 });
			const isResolved = container.classList.contains(CSS_CLASSNAME_THEME_RESOLVED);

			this.navbarManager.setPinned((isInViewport && !isSticky) || !isResolved);
			this.navbarManager.moveNavbar(isSticky && isResolved ? container.offsetHeight : 0);
		},
	};
}
