import {
	AdSlot,
	BigFancyAdAboveConfig,
	context,
	PorvataPlayer,
	slotTweaker,
	TemplateParams,
	UapRatio,
	UapState,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { isUndefined, mapValues } from 'lodash';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { HiviBfaa2Ui } from '../../../../src/ad-products/templates/uap/themes/hivi/hivi-bfaa-2-ui';
import { BigFancyAdHiviTheme } from '../../../../src/ad-products/templates/uap/themes/hivi/hivi-theme';

const { CSS_TIMING_EASE_IN_CUBIC, SLIDE_OUT_TIME } = universalAdPackage;

@Injectable()
export class HandlersShared {
	platformConfig: BigFancyAdAboveConfig;
	closeButton: HTMLElement;
	video: PorvataPlayer;
	viewableAndTimeoutRunning$ = new BehaviorSubject<boolean>(true);
	ui = new HiviBfaa2Ui();
	videoWidth$ = new ReplaySubject<number>();
	readyElement: HTMLElement | HTMLIFrameElement; // required by slotTweaker.setPaddingBottom
	config: BigFancyAdAboveConfig = {
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
		onAfterUnstickBfaaCallback(): void {},
		onResolvedStateSetCallback: () => {},
		onResolvedStateResetCallback: () => {},
		moveNavbar: (offset = 0, time: number = SLIDE_OUT_TIME): void => {
			const navbarElement: HTMLElement = document.querySelector('body > nav.navigation');

			if (navbarElement) {
				navbarElement.style.transition = offset ? '' : `top ${time}ms ${CSS_TIMING_EASE_IN_CUBIC}`;
				navbarElement.style.top = offset ? `${offset}px` : '';
			}
		},
	};

	constructor(private params: TemplateParams) {
		// I don't like that handlers have to know to what template they are assigned
		// this could be solved in something like TemplateParams etc.
		this.platformConfig = context.get('templates.bfaa') || {};
	}

	startStickiness(slot: AdSlot): void {
		// needs a better name!
		this.viewableAndTimeoutRunning$.next(true);
		const slotViewed: Promise<void> = this.platformConfig.stickyUntilSlotViewed
			? slot.loaded.then(() => slot.viewed)
			: Promise.resolve();
		const videoViewed: Promise<void> = this.params.stickyUntilVideoViewed
			? utils.once(slot, AdSlot.VIDEO_VIEWED_EVENT)
			: Promise.resolve();
		const unstickDelay: number = isUndefined(this.params.stickyAdditionalTime)
			? BigFancyAdHiviTheme.DEFAULT_UNSTICK_DELAY
			: this.params.stickyAdditionalTime;

		Promise.all([slotViewed, videoViewed, utils.wait(unstickDelay)]).then(() =>
			this.viewableAndTimeoutRunning$.next(false),
		);
	}

	get currentWidth(): number {
		return this.platformConfig.mainContainer.offsetWidth;
	}

	get aspectRatio(): UapRatio {
		return this.params.config.aspectRatio;
	}

	get currentAspectRatio(): number {
		return this.currentWidth / this.aspectScroll;
	}

	get aspectScroll(): number {
		const minHeight = this.currentWidth / this.aspectRatio.resolved;

		return minHeight;
	}

	get currentState(): number {
		const { aspectRatio } = this.params.config;
		const aspectRatioDiff = aspectRatio.default - aspectRatio.resolved;
		const currentDiff = aspectRatio.default - this.currentAspectRatio;
		return 1 - (aspectRatioDiff - currentDiff) / aspectRatioDiff;
	}

	updateAdSizes(): void {
		this.updateVideoAdSize();

		this.updateStaticAdSize();
	}

	private updateStaticAdSize(): void {
		slotTweaker.setPaddingBottom(this.readyElement, this.currentAspectRatio);
	}

	private updateVideoAdSize(): void {
		const { state } = this.params.config;
		const currentState = this.currentState;
		const heightDiff = state.height.default - state.height.resolved;
		const heightFactor = (state.height.default - heightDiff * currentState) / 100;
		const relativeHeight = this.aspectScroll * heightFactor;

		this.videoWidth$.next(this.params.videoAspectRatio * relativeHeight);

		const style = mapValues(this.params.config.state, (styleProperty: UapState<number>) => {
			const diff: number = styleProperty.default - styleProperty.resolved;

			return `${styleProperty.default - diff * currentState}%`;
		});

		if (this.params.thumbnail) {
			Object.assign(this.params.thumbnail.style, style);
			if (this.video) {
				this.ui.setVideoStyle(this.video, style);
			}
		}
	}
}
