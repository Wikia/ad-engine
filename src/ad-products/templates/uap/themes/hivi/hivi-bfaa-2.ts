import { AdSlot, context, scrollListener, slotTweaker, utils } from '@ad-engine/core';
import { Communicator } from '@wikia/post-quecast';
import * as EventEmitter from 'eventemitter3';
import { isUndefined, mapValues } from 'lodash';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { filter, skip, switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FSM, ReduxExtensionConnector } from 'state-charts';
import {
	BigFancyAdAboveConfig,
	PorvataPlayer,
	resolvedState,
	UapConfig,
	UapRatio,
} from '../../../..';
import { AdvertisementLabel } from '../../../interface/advertisement-label';
import {
	CSS_CLASSNAME_IMPACT_BFAA,
	CSS_CLASSNAME_STICKY_BFAA,
	CSS_CLASSNAME_THEME_RESOLVED,
	SLIDE_OUT_TIME,
} from '../../constants';
import { UapVideoSettings } from '../../uap-video-settings';
import { UapParams, UapState } from '../../universal-ad-package';
import { BigFancyAdTheme } from '../theme';
import { HiviBfaa2Ui } from './hivi-bfaa-2-ui';
import { BigFancyAdHiviTheme } from './hivi-theme';

const HIVI_RESOLVED_THRESHOLD = 0.995;
export const MOVE_NAVBAR = '[UAP HiVi BFAA] move navbar';
export const SET_BODY_PADDING_TOP = '[UAP HiVi BFAA] set body padding top';

type State = any;

const STATES = {
	IMPACT: 'impact',
	INITIAL: 'initial',
	RESOLVED: 'resolved',
	STICKY: 'sticky',
};
const ACTIONS = {
	IMPACT: 'impact',
	RESOLVE: 'resolve',
	RESET: 'reset',
	UNSTICK: 'unstick',
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
			{ action: ACTIONS.RESOLVE, to: STATES.RESOLVED },
			{ action: ACTIONS.CLOSE, to: STATES.RESOLVED },
		],
	},
	{
		name: STATES.IMPACT,
		transitions: [
			{ action: ACTIONS.STICK, to: STATES.STICKY },
			{ action: ACTIONS.RESOLVE, to: STATES.RESOLVED },
		],
	},
];
const bfaaEmitter = new EventEmitter();
const communicator = new Communicator();

const bfaaFsm = new FSM(
	bfaaEmitter,
	bfaaStates,
	bfaaStates.find((state) => state.name === 'initial'),
);
/* tslint:disable */
new ReduxExtensionConnector(bfaaFsm, '[UAP BFAA] ');

function createScrollObservable(): Observable<any> {
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

export class BfaaHiviTheme2 extends BigFancyAdTheme {
	protected platformConfig: BigFancyAdAboveConfig;
	protected gamConfig: UapConfig;
	video: PorvataPlayer;
	viewableAndTimeoutRunning$ = new BehaviorSubject<boolean>(true);
	ui = new HiviBfaa2Ui();

	constructor(protected adSlot: AdSlot, public params: UapParams) {
		super(adSlot, params);
		this.platformConfig = context.get('templates.bfaa') || {};
		this.gamConfig = params.config;

		// ENTER - UI
		bfaaEmitter.on(FSM.events.enter, (state: State) => {
			if (state.name === STATES.INITIAL) {
				this.startStickiness();
			}
			if (state.name === STATES.RESOLVED) {
				slotTweaker.makeResponsive(this.adSlot, this.gamConfig.aspectRatio.resolved);
				this.ui.switchImagesInAd(this.params, true);
				this.adSlot.addClass(CSS_CLASSNAME_THEME_RESOLVED);

				this.updateAdSizes();

				this.setBodyPaddingTop(`${100 / this.currentAspectRatio}%`);
				this.moveNavbar(0, 0);
			}

			if (state.name === STATES.IMPACT) {
				this.adSlot.addClass(CSS_CLASSNAME_IMPACT_BFAA);
				slotTweaker.makeResponsive(this.adSlot, this.gamConfig.aspectRatio.default);
				this.ui.switchImagesInAd(this.params, false);

				this.updateAdSizes();
				// TODO: Update body padding

				createScrollObservable()
					.pipe(takeUntil(leaving$))
					.subscribe(() => {
						// TODO: Update body padding
						this.updateAdSizes();
					});
			}
			if (state.name === STATES.STICKY) {
				this.adSlot.addClass(CSS_CLASSNAME_STICKY_BFAA);
				this.stickNavbar();
			}
		});

		// LEAVE - UI
		bfaaEmitter.on(FSM.events.leave, (state: State) => {
			if (state.name === STATES.RESOLVED) {
				this.adSlot.removeClass(CSS_CLASSNAME_THEME_RESOLVED);
			}

			if (state.name === STATES.STICKY) {
				this.adSlot.removeClass(CSS_CLASSNAME_STICKY_BFAA);
			}

			if (state.name === STATES.IMPACT) {
				this.adSlot.removeClass(CSS_CLASSNAME_IMPACT_BFAA);
			}
		});

		// ENTER - STATE
		bfaaEmitter.on(FSM.events.enter, (state: State) => {
			if (state.name === STATES.RESOLVED) {
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
			}

			if (state.name === STATES.STICKY) {
				// Unstick on scroll only if viewable and timeout
				this.viewableAndTimeoutRunning$
					.pipe(
						filter((running) => !running),
						takeUntil(leaving$),
						switchMap(() => createScrollObservable()),
						take(1),
					)
					.subscribe(() => bfaaFsm.dispatch(ACTIONS.RESOLVE));
			}

			if (state.name === STATES.IMPACT) {
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
			}
		});

		// LEAVE - STATE
		bfaaEmitter.on(FSM.events.leave, (state: State) => {
			if (state.name === STATES.STICKY) {
				communicator.dispatch({ type: MOVE_NAVBAR, payload: { height: 0, time: SLIDE_OUT_TIME } });
			}
		});

		bfaaFsm.init();
	}

	// This is run first
	adIsReady(videoSettings: UapVideoSettings): Promise<HTMLIFrameElement | HTMLElement> {
		resolvedState.isResolvedState(this.params)
			? bfaaFsm.dispatch(ACTIONS.RESOLVE)
			: bfaaFsm.dispatch(ACTIONS.IMPACT);

		return Promise.resolve(this.adSlot.getIframe());
	}

	// This is run next
	onAdReady(): void {
		this.container.classList.add('theme-hivi');
		this.addAdvertisementLabel();
	}

	onVideoReady(video: PorvataPlayer): void {
		this.video = video;

		// Video restart
		fromEvent(video.ima, 'wikiaAdPlayTriggered')
			.pipe(skip(1))
			.subscribe(() => {
				this.startStickiness();
				bfaaFsm.dispatch(ACTIONS.IMPACT);
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

	private updateAdSizes(): Promise<HTMLElement> {
		const { state } = this.gamConfig;
		const currentState = this.currentState;
		const heightDiff = state.height.default - state.height.resolved;
		const heightFactor = (state.height.default - heightDiff * currentState) / 100;
		const relativeHeight = this.aspectScroll * heightFactor;

		this.ui.updateVideoSize(this.video, this.params.videoAspectRatio * relativeHeight);

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

		return slotTweaker.makeResponsive(this.adSlot, this.currentAspectRatio);
	}

	private stickNavbar(): void {
		// TODO: Refactor
		const width: number = this.container.offsetWidth;
		const { aspectRatio } = this.gamConfig;
		const resolvedHeight: number = width / aspectRatio.resolved;

		this.moveNavbar(resolvedHeight, SLIDE_OUT_TIME);
	}

	private moveNavbar(height = 0, time = 0): void {
		communicator.dispatch({ type: MOVE_NAVBAR, payload: { height, time } });
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

	private setBodyPaddingTop(padding: string): void {
		communicator.dispatch({ type: SET_BODY_PADDING_TOP, padding: padding });
	}
}
