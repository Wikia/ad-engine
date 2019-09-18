import { AdSlot, scrollListener, utils } from '@ad-engine/core';
import { animate } from './interface/animate';
import { StickyBase } from './sticky-base';
import {
	CSS_CLASSNAME_FADE_IN_ANIMATION,
	CSS_CLASSNAME_SLIDE_OUT_ANIMATION,
	CSS_CLASSNAME_STICKY_SLOT,
	CSS_CLASSNAME_STICKY_TEMPLATE,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} from './uap/constants';
import { Stickiness } from './uap/themes/hivi/stickiness';
import { UapParams } from './uap/universal-ad-package';

const logGroup = 'sticky-ad';

export interface StickyAdConfig {
	enabled: boolean;
	stickyAdditionalTime: number;
	stickyUntilSlotViewed: boolean;
	handleNavbar: boolean;
	navbarWrapperSelector: string;
	smartBannerSelector: string;
	slotsIgnoringNavbar: string[];
}

export class StickyAd extends StickyBase {
	static getDefaultConfig(): StickyAdConfig {
		return {
			enabled: true,
			stickyAdditionalTime: 0,
			stickyUntilSlotViewed: true,
			handleNavbar: true,
			navbarWrapperSelector: 'body > nav.navigation',
			smartBannerSelector: null,
			slotsIgnoringNavbar: [],
		};
	}

	static getName(): string {
		return 'stickyAd';
	}

	scrollListener: string;
	topOffset = 0;
	leftOffset = 0;

	private get containerDiv(): HTMLDivElement {
		return this.container.querySelector('div');
	}

	constructor(adSlot: AdSlot) {
		super(adSlot);
	}

	init(params: UapParams): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'stickiness rejected');
			this.adSlot.emitEvent(Stickiness.SLOT_STICKINESS_DISABLED);

			return;
		}

		this.setupStickiness(params);
		this.setTopOffset();
		this.setLeftOffset();
		this.setupScrollListener();
		window.addEventListener('resize', () => this.setLeftOffset());
	}

	private setTopOffset(): void {
		if (
			this.config.handleNavbar &&
			this.config.slotsIgnoringNavbar.indexOf(this.adSlot.getSlotName()) === -1
		) {
			const navbarElement = document.querySelector(this.config.navbarWrapperSelector);

			this.topOffset = navbarElement ? navbarElement.offsetHeight : 0;

			if (this.config.smartBannerSelector) {
				const smartBannerElement = document.querySelector(this.config.smartBannerSelector);

				this.topOffset += smartBannerElement ? smartBannerElement.offsetHeight : 0;
			}
		}
	}

	private setLeftOffset(): void {
		this.leftOffset = utils.getLeftOffset(this.containerDiv.firstChild as HTMLElement);
	}

	private setupScrollListener(): void {
		const startOffset = utils.getTopOffset(this.containerDiv) - this.topOffset;

		this.scrollListener = scrollListener.addCallback(() => {
			const scrollPosition =
				window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

			if (scrollPosition >= startOffset) {
				this.stickiness.run();
				utils.logger(logGroup, this.adSlot.getSlotName(), 'stickiness added');
				scrollListener.removeCallback(this.scrollListener);
			}
		});
	}

	protected async onStickinessChange(isSticky: boolean): Promise<void> {
		if (isSticky) {
			this.onStick();
		} else {
			await this.onUnstick();
		}

		utils.logger(logGroup, 'stickiness changed', isSticky);
	}

	protected async onUnstick(): Promise<void> {
		this.adSlot.emitEvent(Stickiness.SLOT_UNSTICKED_STATE);
		await animate(this.containerDiv, CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);
		this.removeStickyParameters();
		animate(this.containerDiv, CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);

		this.removeUnstickButton();
	}

	private removeStickyParameters(): void {
		this.container.classList.remove(CSS_CLASSNAME_STICKY_SLOT);
		this.container.style.height = null;
		this.containerDiv.style.top = null;
		this.containerDiv.style.left = null;
	}

	protected onStick(): void {
		this.adSlot.emitEvent(Stickiness.SLOT_STICKED_STATE);
		this.container.classList.add(CSS_CLASSNAME_STICKY_SLOT);
		this.container.style.height = `${this.containerDiv.offsetHeight}px`;
		this.containerDiv.style.top = `${this.topOffset}px`;
		this.containerDiv.style.left = `${this.leftOffset}px`;

		this.addUnstickButton();
	}

	protected unstickImmediately(): void {
		if (this.stickiness) {
			this.removeStickyParameters();
			this.stickiness.sticky = false;
			this.removeUnstickButton();
			utils.logger(logGroup, 'unstick immediately');
		}
	}

	protected addStickinessPlugin(): void {
		this.container.classList.add(CSS_CLASSNAME_STICKY_TEMPLATE);
		this.addUnstickLogic();
		this.addUnstickEvents();
	}

	private addUnstickButton(): void {
		this.addButton(this.adSlot.getElement().querySelector('div'), () => {
			this.adSlot.emitEvent(Stickiness.SLOT_FORCE_UNSTICK);
			this.stickiness.close();
		});
	}

	private removeUnstickButton(): void {
		this.removeButton();
	}

	/**
	 * Returns template name.
	 */
	protected getName(): string {
		return StickyAd.getName();
	}
}
