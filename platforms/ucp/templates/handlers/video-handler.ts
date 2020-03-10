import {
	AdSlot,
	createBottomPanel,
	Porvata,
	Porvata4Player,
	PorvataTemplateParams,
	ProgressBar,
	ReplayOverlay,
	resolvedState,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	ToggleThumbnail,
	ToggleUI,
	ToggleVideo,
	UapParams,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { fromEvent } from 'rxjs';
import { skip, take, tap } from 'rxjs/operators';
import { UapContext } from './uap-context';

@Injectable()
export class VideoHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.CONTEXT) private context: UapContext,
	) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		if (!universalAdPackage.isVideoEnabled(this.params)) {
			return;
		}
		const isResolvedState = !resolvedState.isResolvedState(this.params);
		const defaultStateAutoPlay = this.params.autoPlay && !isResolvedState;
		const resolvedStateAutoPlay = this.params.resolvedStateAutoPlay && isResolvedState;
		const playerContainer = Porvata.createVideoContainer(this.adSlot.getElement());

		playerContainer.parentElement.classList.add('hide');
		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		this.context.video = utils.createExtendedPromise<Porvata4Player>();
		this.params.autoPlay = Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
		this.params.vastTargeting = { passback: universalAdPackage.getType() };

		const playerParams: PorvataTemplateParams = {
			...this.params,
			container: playerContainer,
			hideWhenPlaying: this.params.videoPlaceholderElement,
		};

		Porvata.inject(playerParams).then((video) => {
			this.context.video.resolve(video);
			this.handleRestart(video, transition);
			this.handleEvents(video);
			this.adjustUI(video, playerContainer, playerParams);
			this.handleManualStartInCtpScenario(video, playerParams, transition);
		});
	}

	/**
	 * Transition to impact when video is restarted
	 */
	private handleRestart(video: Porvata4Player, transition: TemplateTransition<'impact'>): void {
		const restarted$ = fromEvent(video, 'wikiaAdStarted').pipe(skip(1));

		restarted$.subscribe(() => {
			transition('impact', { allowMulticast: true });
			video.unmute();
		});
	}

	private handleEvents(video: Porvata4Player): void {
		video.addEventListener('adCanPlay', () => {
			video.dom.getVideoContainer().classList.remove('hide');
		});
		video.addEventListener('wikiaAdStarted', () => {
			video.addEventListener('wikiaAdCompleted', () => {
				video.reload();
			});
		});
	}

	private adjustUI(
		video: Porvata4Player,
		playerContainer: HTMLElement,
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

	private handleManualStartInCtpScenario(
		video: Porvata4Player,
		params: PorvataTemplateParams,
		transition: TemplateTransition,
	): void {
		if (!params.autoPlay && this.adSlot.getTargeting().loc === 'top') {
			fromEvent(video, 'wikiaAdStarted')
				.pipe(
					take(1),
					tap(() => transition('impact', { allowMulticast: true })),
				)
				.subscribe();
		}
	}

	async onLeave(): Promise<void> {}
}
