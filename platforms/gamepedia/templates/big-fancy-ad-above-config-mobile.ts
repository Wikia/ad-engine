import {
	context,
	NavbarManager,
	scrollListener,
	slotTweaker,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';

const {
	CSS_CLASSNAME_STICKY_BFAA,
	CSS_TIMING_EASE_IN_CUBIC,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} = universalAdPackage;

export function getBfaaConfigMobile(): any {
	return {
		adjustPageMarginOnScroll: null,
		autoPlayAllowed: true,
		defaultStateAllowed: true,
		fullscreenAllowed: true,
		stickinessAllowed: true,
		adSlot: null,
		templateParams: null,
		updateNavbarOnScroll: null,
		slotsToDisable: ['cdm-zone-02', 'cdm-zone-03', 'cdm-zone-04', 'cdm-zone-06'],
		navbarElement: null,
		navbarManager: null,

		onInit(adSlot, params, config): void {
			this.adSlot = adSlot;
			this.templateParams = params;
			this.config = config || context.get('templates.bfaa') || {};
			this.navbarElement = document.getElementsByClassName('header-container')[0];
			this.navbarManager = new NavbarManager(this.navbarElement);

			slotTweaker.onReady(adSlot).then(() => {
				this.adjustPageMargin();
				this.adjustPageMarginOnScroll = scrollListener.addCallback(() => this.adjustPageMargin());

				const container = this.adSlot.getElement();

				// For unknown reasons container.offsetHeight is a little bit different before setTimeout
				setTimeout(() => this.moveNavbar(this.isSticky() ? container.offsetHeight : 0));
			});

			// On navigation to search - hide UAP
			// Monitoring hash change is the only way I found to detect navigation to search page
			window.addEventListener(
				'hashchange',
				(e: HashChangeEvent) => {
					if (e.newURL.endsWith('/search')) {
						this.adSlot.emit('unstickImmediately');
						this.setTopMargin(this.config.mainContainer, '0');
						this.setTopMargin(this.navbarElement, '0');
						this.moveNavbar(0);
						this.config.mainContainer.classList.remove('has-bfaa');
						this.config.mainContainer.style.setProperty('padding-top', '0');
						this.adSlot.hide();
						this.navbarElement.style.setProperty('z-index', '1');
					}
				},
				{ passive: true, once: true },
			);

			this.navbarElement.style.zIndex = '9000';
		},

		onAfterStickBfaaCallback(): void {
			this.updateNavbarPosition();
			this.updateNavbarOnScroll = scrollListener.addCallback(() => this.updateNavbarPosition());
		},

		onBeforeUnstickBfaaCallback(): void {
			scrollListener.removeCallback(this.adjustPageMarginOnScroll);
			Object.assign(this.navbarElement.style, {
				transition:
					`top ${SLIDE_OUT_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}, ` +
					`opacity ${FADE_IN_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}`,
				opacity: '0',
				top: 0,
			});
		},

		onAfterUnstickBfaaCallback(): void {
			scrollListener.removeCallback(this.updateNavbarOnScroll);
			this.updateNavbarPosition();
			this.navbarManager.setPinned(true);
			this.setTopMargin(this.navbarElement, `-${this.navbarElement.offsetHeight}px`);
			Object.assign(this.adSlot.getElement().parentNode.style, {
				position: 'absolute',
			});
			this.adjustPageMargin(true);
			this.adjustSlotMargin();
			this.navbarElement.style.setProperty('top', '');
		},

		onResolvedStateSetCallback(): void {
			scrollListener.removeCallback(this.adjustPageMarginOnScroll);

			this.adjustPageMargin(true);
			this.adjustSlotMargin();

			if (this.isSticky()) {
				const aspectRatio = this.getSlotRatio(true);

				this.navbarElement.style.setProperty('top', `calc(${100 / aspectRatio}vw)`);
			}
		},

		onResolvedStateResetCallback(): void {
			this.adjustPageMargin(false);
			this.removeSlotMargin();
		},

		isResolved(): boolean {
			const container: HTMLElement = this.adSlot.getElement();

			return container.classList.contains('theme-resolved');
		},

		isSticky(): boolean {
			const container: HTMLElement = this.adSlot.getElement();

			return container.classList.contains(CSS_CLASSNAME_STICKY_BFAA);
		},

		getSlotRatio(resolved: boolean): number {
			const aspectRatios = this.templateParams.config.aspectRatio;

			return resolved ? aspectRatios.resolved : aspectRatios.default;
		},

		adjustPageMargin(resolved?: boolean): void {
			const isResolved: boolean = resolved !== undefined ? resolved : this.isResolved();
			const aspectRatio: number = this.getSlotRatio(isResolved);

			this.setTopMargin(
				this.config.mainContainer,
				`calc(${100 / aspectRatio}vw + ${this.navbarManager.getHeight() - 1}px)`,
			);
		},

		adjustSlotMargin(): void {
			if (!this.isSticky()) {
				const container: HTMLElement = this.adSlot.getElement();
				const { top, left } = utils.getElementOffset(container);

				const currentMarginTop: number = parseInt(container.style.marginTop, 10) || 0;
				const currentMarginLeft: number = parseInt(container.style.marginLeft, 10) || 0;

				container.style.setProperty('margin-top', `${currentMarginTop - top}px`);
				container.style.setProperty('margin-left', `${currentMarginLeft - left}px`);
				container.style.setProperty('width', `100vw`);
			}
		},

		setTopMargin(element: HTMLElement, value: string): void {
			element.style.setProperty('margin-top', value);
		},

		removeSlotMargin(): void {
			const container: HTMLElement = this.adSlot.getElement();

			container.style.removeProperty('margin-top');
		},

		updateNavbarPosition(): void {
			const container = this.adSlot.getElement();

			this.moveNavbar(this.isSticky() ? container.offsetHeight : 0);
		},

		moveNavbar(offset: number, animationTime?: number): void {
			// UGLY HACK
			// Control navbar movement to avoid side-effects.
			// AdEngine calls this method with second argument.
			if (animationTime) {
				return;
			}
			this.navbarElement.style.top = offset ? `${offset}px` : '';
		},
	};
}
