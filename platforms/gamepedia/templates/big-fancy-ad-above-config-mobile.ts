import { context, NavbarManager, slotTweaker, universalAdPackage, utils } from '@wikia/ad-engine';

const { CSS_TIMING_EASE_IN_CUBIC, FADE_IN_TIME, SLIDE_OUT_TIME } = universalAdPackage;
const navbarBorderSize = 1;

export function getBfaaConfigMobile(): any {
	return {
		autoPlayAllowed: true,
		defaultStateAllowed: true,
		fullscreenAllowed: true,
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

		onInit(adSlot, params, config): void {
			this.adSlot = adSlot;
			this.templateParams = params;
			this.config = config || context.get('templates.bfaa') || {};
			this.navbarElement = document.getElementsByClassName('header-container')[0];
			this.navbarManager = new NavbarManager(this.navbarElement);

			slotTweaker.onReady(adSlot).then(() => {
				this.adjustPageMargin();

				this.moveNavbar(navbarBorderSize * 2 - this.navbarManager.getHeight());
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
			const aspectRatio = this.getSlotRatio(true);

			this.navbarElement.style.setProperty('position', 'fixed');
			this.navbarElement.style.setProperty('top', `calc(${100 / aspectRatio}vw)`);
			this.removeSlotMargin();
		},

		onBeforeUnstickBfaaCallback(): void {
			Object.assign(this.navbarElement.style, {
				transition:
					`top ${SLIDE_OUT_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}, ` +
					`opacity ${FADE_IN_TIME}ms ${CSS_TIMING_EASE_IN_CUBIC}`,
				opacity: '0',
				top: 0,
			});
		},

		onAfterUnstickBfaaCallback(): void {
			this.moveNavbar(0);
			this.navbarManager.setPinned(true);
			this.setTopMargin(this.navbarElement, `-${this.navbarElement.offsetHeight}px`);
			Object.assign(this.adSlot.getElement().parentNode.style, {
				position: 'absolute',
			});
			this.adjustPageMargin(true);
			this.adjustSlotMargin(true);
			this.navbarElement.style.setProperty('position', '');
			this.navbarElement.style.setProperty('top', '');
		},

		onResolvedStateSetCallback(): void {
			this.adjustPageMargin(true);
			this.adjustSlotMargin(true);
		},

		onResolvedStateResetCallback(): void {
			this.adjustPageMargin(false);
			this.removeSlotMargin();
		},

		isResolved(): boolean {
			const container: HTMLElement = this.adSlot.getElement();

			return container.classList.contains('theme-resolved');
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
				`calc(${100 / aspectRatio}vw + ${this.navbarManager.getHeight() - navbarBorderSize}px)`,
			);
		},

		adjustSlotMargin(resolved?: boolean): void {
			const aspectRatio = this.getSlotRatio(resolved);
			const container: HTMLElement = this.adSlot.getElement();

			const { left } = utils.getElementOffset(container);
			const currentMarginTop: number = parseInt(container.style.marginTop, 10) || 0;
			const currentMarginLeft: number = parseInt(container.style.marginLeft, 10) || 0;

			container.style.setProperty(
				'margin-top',
				`calc(-${100 / aspectRatio}% - ${this.navbarManager.getHeight() + currentMarginTop}px)`,
				'important',
			);
			container.style.setProperty('margin-left', `${currentMarginLeft - left}px`, 'important');
			container.style.setProperty('width', '100vw', 'important');
		},

		setTopMargin(element: HTMLElement, value: string): void {
			element.style.setProperty('margin-top', value);
		},

		removeSlotMargin(): void {
			const container: HTMLElement = this.adSlot.getElement();

			container.style.removeProperty('margin-top');
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
