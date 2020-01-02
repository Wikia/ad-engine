import { AdSlot, context, scrollListener, slotTweaker, utils } from '@ad-engine/core';
import * as EventEmitter from 'eventemitter3';
import { isUndefined, mapValues } from 'lodash';
import { BehaviorSubject, fromEvent, Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, skip, switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FSM, ReduxExtensionConnector, State } from 'state-charts';
import {
	BigFancyAdAboveConfig,
	PorvataPlayer,
	resolvedState,
	UapConfig,
	UapRatio,
} from '../../../..';
import { AdvertisementLabel } from '../../../interface/advertisement-label';
import { animate } from '../../../interface/animate';
import {
	CSS_CLASSNAME_FADE_IN_ANIMATION,
	CSS_CLASSNAME_IMPACT_BFAA,
	CSS_CLASSNAME_SLIDE_OUT_ANIMATION,
	CSS_CLASSNAME_STICKY_BFAA,
	CSS_CLASSNAME_THEME_RESOLVED,
	FADE_IN_TIME,
	SLIDE_OUT_TIME,
} from '../../constants';
import { UapVideoSettings } from '../../uap-video-settings';
import { UapParams, UapState } from '../../universal-ad-package';
import { BigFancyAdTheme } from '../theme';
import { HiviBfaa2Ui } from './hivi-bfaa-2-ui';
import { BigFancyAdHiviTheme } from './hivi-theme';

const HIVI_RESOLVED_THRESHOLD = 0.995;

const STATES = {
	IMPACT: 'impact',
	INITIAL: 'initial',
	RESOLVED: 'resolved',
	STICKY: 'sticky',
	TRANSITION: 'transition',
};
const ACTIONS = {
	IMPACT: 'impact',
	RESOLVE: 'resolve',
	RESET: 'reset',
	CLOSE: 'close-click',
	STICK: 'stick',
};

const bfaaStates = [
	{
		name: STATES.INITIAL,
		transitions: [
			{ action: ACTIONS.IMPACT, to: STATES.IMPACT },
			{ action: ACTIONS.RESOLVE, to: STATES.RESOLVED },
			{ action: ACTIONS.STICK, to: STATES.STICKY },
		],
	},
	{
		name: STATES.RESOLVED,
		transitions: [
			{ action: ACTIONS.STICK, to: STATES.STICKY },
			{ action: ACTIONS.IMPACT, to: STATES.IMPACT },
		],
	},
	{
		name: STATES.STICKY,
		transitions: [
			{ action: ACTIONS.RESOLVE, to: STATES.TRANSITION },
			{ action: ACTIONS.CLOSE, to: STATES.TRANSITION },
		],
	},
	{
		name: STATES.TRANSITION,
		transitions: [{ action: ACTIONS.RESOLVE, to: STATES.RESOLVED }],
	},
	{
		name: STATES.IMPACT,
		transitions: [
			{ action: ACTIONS.STICK, to: STATES.STICKY },
			{ action: ACTIONS.RESOLVE, to: STATES.TRANSITION },
			{ action: ACTIONS.CLOSE, to: STATES.TRANSITION },
		],
	},
];
const bfaaEmitter = new EventEmitter();

const bfaaFsm = new FSM(
	bfaaEmitter,
	bfaaStates,
	bfaaStates.find((state) => state.name === 'initial'),
);
/* tslint:disable */
new ReduxExtensionConnector(bfaaFsm, '[UAP BFAA] ');

export function createScrollObservable(): Observable<any> {
	// TODO: Create observable monitoring subscriptions
	return new Observable((observer) => {
		const listenerId = scrollListener.addCallback(() => {
			observer.next();
		});

		return () => scrollListener.removeCallback(listenerId);
	});
}

const entering$ = new Subject<State>();
const leaving$ = new Subject<State>();

bfaaEmitter.on(FSM.events.enter, (state: State) => {
	entering$.next(state);
});

bfaaEmitter.on(FSM.events.leave, (state: State) => {
	leaving$.next(state);
});

function ofState(stateName: string) {
	// TODO: Add return type
	return filter((state: State) => state.name === stateName);
}

export class BfaaHiviTheme2 extends BigFancyAdTheme {
	protected platformConfig: BigFancyAdAboveConfig;
	protected gamConfig: UapConfig;
	video: PorvataPlayer;
	viewableAndTimeoutRunning$ = new BehaviorSubject<boolean>(true);
	ui = new HiviBfaa2Ui();
	videoWidth$ = new ReplaySubject<number>();
	readyElement: HTMLElement | HTMLIFrameElement; // required by slotTweaker.setPaddingBottom

	constructor(protected adSlot: AdSlot, public params: UapParams) {
		super(adSlot, params);
		this.platformConfig = context.get('templates.bfaa') || {};
		this.gamConfig = params.config;

		entering$.pipe(ofState(STATES.INITIAL)).subscribe(() => {
			this.startStickiness();
			this.container.classList.add('theme-hivi');
		});

		entering$.pipe(ofState(STATES.RESOLVED)).subscribe(() => {
			slotTweaker.setPaddingBottom(this.readyElement, this.gamConfig.aspectRatio.resolved);
			this.ui.switchImagesInAd(this.params, true);
			this.adSlot.addClass(CSS_CLASSNAME_THEME_RESOLVED);

			this.updateAdSizes();

			this.moveNavbar(0, 0);
			this.ui.setBodyPaddingTop(`${this.aspectRatio.resolved}%`);

			// Stick on scroll only if not viewable and not timeout
			this.viewableAndTimeoutRunning$
				.pipe(
					filter((running) => !!running),
					switchMap(() => {
						return createScrollObservable().pipe(
							takeUntil(this.viewableAndTimeoutRunning$.pipe(filter((running) => !running))),
							takeUntil(leaving$),
						);
					}),
				)
				.subscribe(() => bfaaFsm.dispatch(ACTIONS.STICK));
		});

		entering$.pipe(ofState(STATES.IMPACT)).subscribe(() => {
			this.adSlot.addClass(CSS_CLASSNAME_IMPACT_BFAA);
			this.ui.switchImagesInAd(this.params, false);
			slotTweaker.setPaddingBottom(this.readyElement, this.gamConfig.aspectRatio.default);
			this.updateAdSizes();
			this.moveNavbar(this.container.offsetHeight);
			this.ui.setBodyPaddingTop(`${100 / this.aspectRatio.default}%`);

			createScrollObservable()
				.pipe(takeUntil(leaving$))
				.subscribe(() => {
					// TODO: Update body padding
					this.updateAdSizes();
					this.moveNavbar(this.container.offsetHeight);
				});

			// When smaller than HIVI_RESOLVED_THRESHOLD
			createScrollObservable()
				.pipe(
					takeUntil(leaving$),
					filter(() => this.currentState >= HIVI_RESOLVED_THRESHOLD),
					take(1),
					withLatestFrom(this.viewableAndTimeoutRunning$),
				)
				.subscribe(([_, running]) => {
					if (running) {
						// if not timeout and not viewable
						bfaaFsm.dispatch(ACTIONS.STICK);
					} else {
						// if timeout and viewable
						bfaaFsm.dispatch(ACTIONS.RESOLVE);
					}
				});
		});

		entering$.pipe(ofState(STATES.STICKY)).subscribe(() => {
			this.ui.addCloseButton(this.container, () => bfaaFsm.dispatch(ACTIONS.CLOSE));
			this.adSlot.addClass(CSS_CLASSNAME_STICKY_BFAA);
			this.ui.switchImagesInAd(this.params, true);
			this.stickNavbar();
			this.updateAdSizes();

			// Unstick on scroll only if viewable and timeout
			this.viewableAndTimeoutRunning$
				.pipe(
					filter((running) => !running),
					takeUntil(leaving$),
					switchMap(() => createScrollObservable()),
					take(1),
				)
				.subscribe(() => bfaaFsm.dispatch(ACTIONS.RESOLVE));
		});

		entering$.pipe(ofState(STATES.TRANSITION)).subscribe(async () => {
			this.platformConfig.moveNavbar(0, SLIDE_OUT_TIME);
			await animate(this.container, CSS_CLASSNAME_SLIDE_OUT_ANIMATION, SLIDE_OUT_TIME);
			this.adSlot.removeClass(CSS_CLASSNAME_STICKY_BFAA);
			this.adSlot.removeClass(CSS_CLASSNAME_IMPACT_BFAA);
			animate(this.adSlot.getElement(), CSS_CLASSNAME_FADE_IN_ANIMATION, FADE_IN_TIME);
			window.scrollBy(0, -Math.min(this.getHeightDifferenceBetweenStates(), window.scrollY));

			bfaaFsm.dispatch(ACTIONS.RESOLVE);
		});

		leaving$.pipe(ofState(STATES.RESOLVED)).subscribe(() => {
			this.adSlot.removeClass(CSS_CLASSNAME_THEME_RESOLVED);
		});

		leaving$.pipe(ofState(STATES.STICKY)).subscribe(() => {
			this.ui.removeCloseButton();
		});

		bfaaFsm.init();
	}

	// This is run first
	async adIsReady(videoSettings: UapVideoSettings): Promise<HTMLIFrameElement | HTMLElement> {
		this.readyElement = await slotTweaker.onReady(this.adSlot);

		return this.readyElement;
	}

	// This is run next
	onAdReady(): void {
		this.addAdvertisementLabel();

		resolvedState.isResolvedState(this.params)
			? bfaaFsm.dispatch(ACTIONS.RESOLVE)
			: bfaaFsm.dispatch(ACTIONS.IMPACT);
	}

	onVideoReady(video: PorvataPlayer): void {
		this.video = video;
		this.videoWidth$.subscribe((width) => {
			this.ui.updateVideoSize(video, width);
		});

		// Video restart
		fromEvent(video.ima, 'wikiaAdPlayTriggered')
			.pipe(skip(1))
			.subscribe(() => {
				this.startStickiness();
				bfaaFsm.dispatch(ACTIONS.IMPACT);
			});

		fromEvent(video.ima, 'wikiaAdStarted').subscribe(() => {
			this.updateVideoAdSize(); // Must resize video container once more
		});
	}

	addAdvertisementLabel(): void {
		const advertisementLabel = new AdvertisementLabel();

		this.container.appendChild(advertisementLabel.render());
	}

	get currentWidth(): number {
		return this.platformConfig.mainContainer.offsetWidth;
	}

	get aspectRatio(): UapRatio {
		return this.gamConfig.aspectRatio;
	}

	get currentAspectRatio(): number {
		return this.currentWidth / this.aspectScroll;
	}

	get aspectScroll(): number {
		const maxHeight = this.currentWidth / this.aspectRatio.default;
		const minHeight = this.currentWidth / this.aspectRatio.resolved;
		const scrollY = window.scrollY || window.pageYOffset || 0;

		return bfaaFsm.state.name === STATES.IMPACT
			? Math.max(minHeight, maxHeight - scrollY)
			: minHeight;
	}

	get currentState(): number {
		const { aspectRatio } = this.gamConfig;
		const aspectRatioDiff = aspectRatio.default - aspectRatio.resolved;
		const currentDiff = aspectRatio.default - this.currentAspectRatio;
		return 1 - (aspectRatioDiff - currentDiff) / aspectRatioDiff;
	}

	private updateAdSizes(): void {
		this.updateVideoAdSize();

		this.updateStaticAdSize();
	}

	private updateStaticAdSize(): void {
		slotTweaker.setPaddingBottom(this.readyElement, this.currentAspectRatio);
	}

	private updateVideoAdSize(): void {
		const { state } = this.gamConfig;
		const currentState = this.currentState;
		const heightDiff = state.height.default - state.height.resolved;
		const heightFactor = (state.height.default - heightDiff * currentState) / 100;
		const relativeHeight = this.aspectScroll * heightFactor;

		this.videoWidth$.next(this.params.videoAspectRatio * relativeHeight);

		const style = mapValues(this.gamConfig.state, (styleProperty: UapState<number>) => {
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

	private stickNavbar(): void {
		const width: number = this.container.offsetWidth;
		const { aspectRatio } = this.gamConfig;
		const resolvedHeight: number = width / aspectRatio.resolved;

		this.moveNavbar(resolvedHeight, SLIDE_OUT_TIME);
	}

	private moveNavbar(height = 0, time = 0): void {
		this.platformConfig.moveNavbar(height, time);
	}

	protected startStickiness() {
		// needs a better name!
		this.viewableAndTimeoutRunning$.next(true);
		const slotViewed: Promise<void> = this.platformConfig.stickyUntilSlotViewed
			? this.adSlot.loaded.then(() => this.adSlot.viewed)
			: Promise.resolve();
		const videoViewed: Promise<void> = this.params.stickyUntilVideoViewed
			? utils.once(this.adSlot, AdSlot.VIDEO_VIEWED_EVENT)
			: Promise.resolve();
		const unstickDelay: number = isUndefined(this.params.stickyAdditionalTime)
			? BigFancyAdHiviTheme.DEFAULT_UNSTICK_DELAY
			: this.params.stickyAdditionalTime;

		Promise.all([slotViewed, videoViewed, utils.wait(unstickDelay)]).then(() =>
			this.viewableAndTimeoutRunning$.next(false),
		);
	}

	private getHeightDifferenceBetweenStates(): number {
		const width: number = this.container.offsetWidth;
		const { aspectRatio } = this.params.config;

		return Math.round(width / aspectRatio.default - width / aspectRatio.resolved);
	}
}

// TODO: Emit events
