import { Dictionary, SlotTweaker, utils } from '@wikia/ad-engine';
import { setupNavbar } from '../utils';
import AdvertisementLabel from './interface/advertisement-label';
import { animate } from './interface/animate';
import { StickyBase } from './sticky-base';
import { StickinessCallback } from './uap/big-fancy-ad-above';
import {
	CSS_CLASSNAME_FADE_IN_ANIMATION,
	CSS_CLASSNAME_SLIDE_OUT_ANIMATION,
	CSS_CLASSNAME_STICKY_BFAA,
	CSS_CLASSNAME_STICKY_IAB,
	CSS_CLASSNAME_THEME_RESOLVED,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} from './uap/constants';
import { Stickiness } from './uap/themes/hivi/stickiness';
import { universalAdPackage } from './uap/universal-ad-package';

const logGroup = 'sticky-tlb';

export class StickyTLB extends StickyBase {
	static getDefaultConfig() {
		return {
			enabled: true,
			desktopNavbarWrapperSelector: '.wds-global-navigation-wrapper',
			mobileNavbarWrapperSelector: '.global-navigation-mobile-wrapper',
			mainContainer: document.body,
			handleNavbar: false,
			stickyAdditionalTime: 0,
			stickyDefaultTime: 0,
			stickyUntilSlotViewed: true,
			slotSibling: '.topic-header',
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
						: `top ${time}ms ${universalAdPackage.CSS_TIMING_EASE_IN_CUBIC}`;
					navbarElement.style.top = offset ? `${offset}px` : '';
				}
			},
		};
	}

	static getName(): string {
		return 'stickyTLB';
	}

	async init(params: Dictionary): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'stickiness rejected');
			this.adSlot.emitEvent(Stickiness.SLOT_STICKINESS_DISABLED);

			return;
		}

		this.setupStickiness(params);

		this.container.style.backgroundColor = '#000';
		this.container.classList.add('bfaa-template');

		try {
			await this.config.onInit(this.adSlot, this.params, this.config);
		} catch (e) {}
		this.onAdReady();
	}

	protected async onAdReady(): Promise<void> {
		this.container.classList.add('theme-hivi');
		this.addAdvertisementLabel();

		this.config.mainContainer.style.paddingTop = `${this.container.scrollHeight}px`;
		this.config.mainContainer.classList.add('has-bfaa');

		setupNavbar(this.config, this.container);
		this.config.moveNavbar(this.container.scrollHeight, SLIDE_OUT_TIME);

		if (document.hidden) {
			await utils.once(window, 'visibilitychange');
		}

		utils.logger(logGroup, 'ad ready');
	}

	protected addAdvertisementLabel(): void {
		const advertisementLabel: AdvertisementLabel = new AdvertisementLabel();

		this.container.appendChild(advertisementLabel.render());
	}

	protected async onStickinessChange(isSticky: boolean): Promise<void> {
		const stickinessBeforeCallback: StickinessCallback = isSticky
			? this.config.onBeforeStickBfaaCallback
			: this.config.onBeforeUnstickBfaaCallback;
		const stickinessAfterCallback: StickinessCallback = isSticky
			? this.config.onAfterStickBfaaCallback
			: this.config.onAfterUnstickBfaaCallback;

		stickinessBeforeCallback.call(this.config, this.adSlot, this.params);

		if (isSticky) {
			this.onStick();
		} else {
			await this.onUnstick();
		}

		stickinessAfterCallback.call(this.config, this.adSlot, this.params);
		utils.logger(logGroup, 'stickiness changed', isSticky);
	}

	protected async onUnstick(): Promise<void> {
		this.adSlot.emitEvent(Stickiness.SLOT_UNSTICKED_STATE);
		this.config.moveNavbar(0, SLIDE_OUT_TIME);
		await animate(this.container, CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);
		this.container.classList.remove(CSS_CLASSNAME_STICKY_BFAA);
		this.container.classList.add(CSS_CLASSNAME_THEME_RESOLVED);
		animate(this.container, CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);
	}

	protected onStick(): void {
		this.adSlot.emitEvent(Stickiness.SLOT_STICKED_STATE);
		this.container.classList.add(CSS_CLASSNAME_STICKY_BFAA);

		this.addCloseButton();
	}

	protected unstickImmediately(): void {
		this.config.moveNavbar(0, 0);
		this.container.classList.remove(CSS_CLASSNAME_STICKY_BFAA);
		this.container.classList.add(CSS_CLASSNAME_THEME_RESOLVED);
		this.stickiness.sticky = false;
		this.config.mainContainer.style.paddingTop = '0';
		this.container.classList.add('hide');
		utils.logger(logGroup, 'unstick immediately');

		this.removeCloseButton();
	}

	protected addStickinessPlugin(): void {
		this.container.classList.add(CSS_CLASSNAME_STICKY_IAB);
		this.addUnstickLogic();
		this.addUnstickEvents();
		this.stickiness.run();
		utils.logger(logGroup, this.adSlot.getSlotName(), 'stickiness added');
	}

	protected addCloseButton(): void {
		this.addButton(this.container, () => {
			this.stickiness.close();
			this.adSlot.emitEvent(SlotTweaker.SLOT_CLOSE_IMMEDIATELY);
		});
	}

	protected removeCloseButton(): void {
		this.removeButton();
	}

	/**
	 * Returns template name.
	 */
	protected getName(): string {
		return StickyTLB.getName();
	}

	protected isEnabled(): boolean {
		return super.isEnabled() && !!this.container;
	}
}
