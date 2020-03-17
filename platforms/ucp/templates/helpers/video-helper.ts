import {
	AdSlot,
	createBottomPanel,
	DomManipulator,
	Porvata,
	Porvata4Player,
	PorvataTemplateParams,
	ProgressBar,
	ReplayOverlay,
	resolvedState,
	TemplateTransition,
	ToggleThumbnail,
	ToggleUI,
	ToggleVideo,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { fromEvent } from 'rxjs';
import { filter, skip } from 'rxjs/operators';

export class VideoHelper {
	constructor(
		private manipulator: DomManipulator,
		private params: UapParams,
		private adSlot: AdSlot,
	) {}

	/**
	 * Sets video size.
	 *
	 * Scales from impact to default ratio during scroll.
	 *
	 * @param video Porvata video
	 * @param fixedProgress if provided then this value is used instead of calculated progress
	 */
	setDynamicVideoImpactSize(video: Porvata4Player, fixedProgress?: number): void {
		if (!video.isFullscreen()) {
			const slotHeight = this.adSlot.getElement().offsetHeight;
			const progress = fixedProgress === undefined ? this.getImpactProgress() : fixedProgress;

			const heightMultiplier =
				this.params.config.state.height.default +
				progress *
					(this.params.config.state.height.resolved - this.params.config.state.height.default);

			const margin = (100 - heightMultiplier) / 2;
			const height = (slotHeight * heightMultiplier) / 100;
			const width = height * this.params.videoAspectRatio;

			this.setVideoSize(video, width, height, margin);
		}
	}

	/**
	 * Progress changes between 0 (impact, full height) to 1 (resolved size);
	 * used to make video height transition smooth between
	 * this.params.config.state.height.default
	 * and this.params.config.state.height.resolved
	 */
	getImpactProgress(): number {
		const slotWidth = this.adSlot.getElement().offsetWidth;
		const slotResolvedHeight = slotWidth / this.params.config.aspectRatio.resolved;
		const slotDefaultHeight = slotWidth / this.params.config.aspectRatio.default;

		return window.scrollY / (slotDefaultHeight - slotResolvedHeight);
	}

	/**
	 * Sets video size using resolved ratio.
	 *
	 * @param video Porvata video
	 */
	setVideoResolvedSize(video: Porvata4Player): void {
		if (!video.isFullscreen()) {
			const slotHeight = this.adSlot.getElement().offsetHeight;
			const margin = (100 - this.params.config.state.height.resolved) / 2;
			const height = slotHeight * (this.params.config.state.height.resolved / 100);
			const width = height * this.params.videoAspectRatio;

			this.setVideoSize(video, width, height, margin);
		}
	}

	private setVideoSize(video: Porvata4Player, width: number, height: number, margin: number): void {
		video.resize(width, height);

		const videoOverlay = video.dom.getPlayerContainer().parentElement;

		this.manipulator.element(videoOverlay).setProperty('width', `${width}px`);
		this.manipulator.element(videoOverlay).setProperty('height', `${height}px`);
		this.manipulator.element(videoOverlay).setProperty('top', `${margin}%`);

		const thumbnail = this.params.thumbnail;

		this.manipulator.element(thumbnail).setProperty('width', `${width}px`);
		this.manipulator.element(thumbnail).setProperty('height', `${height}px`);
		this.manipulator.element(thumbnail).setProperty('top', `${margin}%`);
	}

	getPlayerParams(): PorvataTemplateParams {
		return {
			...this.params,
			vastTargeting: { passback: universalAdPackage.getType() },
			autoPlay: this.isAutoPlayEnabled(this.params),
			container: this.createPlayerContainer(this.adSlot),
			hideWhenPlaying: this.params.videoPlaceholderElement,
		};
	}

	createPlayerContainer(adSlot: AdSlot): HTMLDivElement {
		const playerContainer = Porvata.createVideoContainer(this.adSlot.getElement());

		playerContainer.parentElement.classList.add('hide');

		return playerContainer;
	}

	private isAutoPlayEnabled(params: UapParams): boolean {
		const isResolvedState = !resolvedState.isResolvedState(params);
		const defaultStateAutoPlay = params.autoPlay && !isResolvedState;
		const resolvedStateAutoPlay = params.resolvedStateAutoPlay && isResolvedState;

		return Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
	}

	/**
	 * Transition to impact when video is restarted
	 */
	handleRestart(video: Porvata4Player, transition: TemplateTransition<'impact'>): void {
		const restarted$ = fromEvent(video, 'wikiaAdStarted').pipe(skip(1));

		restarted$.subscribe(() => {
			// TODO: timeout manager
			// this.timeoutManager.start(universalAdPackage.BFAA_UNSTICK_DELAY);
			transition('impact', { allowMulticast: true });
			video.unmute();
		});
	}

	handleEvents(video: Porvata4Player): void {
		video.addEventListener('adCanPlay', () => {
			video.dom.getVideoContainer().classList.remove('hide');
		});
		video.addEventListener('wikiaAdStarted', () => {
			video.addEventListener('wikiaAdCompleted', () => {
				video.reload();
			});
		});

		fromEvent(this.adSlot, AdSlot.CUSTOM_EVENT)
			.pipe(
				filter(
					(event: { status: string }) => event.status === universalAdPackage.SLOT_FORCE_UNSTICK,
				),
			)
			.subscribe(() => video.stop());
	}

	adjustUI(
		video: Porvata4Player,
		playerContainer: HTMLDivElement,
		params: PorvataTemplateParams,
	): void {
		ProgressBar.add(video, video.dom.getInterfaceContainer());
		createBottomPanel({ fullscreenAllowed: this.params.fullscreenAllowed, theme: 'hivi' }).add(
			video,
			video.dom.getInterfaceContainer(),
			params,
		);
		ToggleUI.add(video, video.dom.getInterfaceContainer(), params);
		ToggleVideo.add(video, playerContainer.parentElement);
		ToggleThumbnail.add(video, undefined, params);
		ReplayOverlay.add(video, video.dom.getPlayerContainer(), params);
	}

	setCtpTargeting(): void {
		const isAutoPlayEnabled = this.isAutoPlayEnabled(this.params);

		const audioSuffix = !isAutoPlayEnabled ? '-audio' : '';
		const clickToPlaySuffix = isAutoPlayEnabled ? '' : '-ctp';

		this.adSlot.setConfigProperty('slotNameSuffix', clickToPlaySuffix || audioSuffix || '');
		this.adSlot.setConfigProperty('targeting.audio', audioSuffix ? 'yes' : 'no');
		this.adSlot.setConfigProperty('targeting.ctp', clickToPlaySuffix ? 'yes' : 'no');
	}
}
