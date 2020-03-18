import {
	AdSlot,
	createBottomPanel,
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

export class VideoBootstrapHelper {
	constructor(private params: UapParams, private adSlot: AdSlot) {}

	/**
	 * Transition to impact when video is restarted
	 */
	handleRestart(video: Porvata4Player, transition: TemplateTransition<'impact'>): void {
		const restarted$ = fromEvent(video, 'wikiaAdStarted').pipe(skip(1));

		restarted$.subscribe(() => {
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
		const isAutoPlayEnabled = this.isAutoPlayEnabled();

		const audioSuffix = !isAutoPlayEnabled ? '-audio' : '';
		const clickToPlaySuffix = isAutoPlayEnabled ? '' : '-ctp';

		this.adSlot.setConfigProperty('slotNameSuffix', clickToPlaySuffix || audioSuffix || '');
		this.adSlot.setConfigProperty('targeting.audio', audioSuffix ? 'yes' : 'no');
		this.adSlot.setConfigProperty('targeting.ctp', clickToPlaySuffix ? 'yes' : 'no');
	}

	getPlayerParams(): PorvataTemplateParams {
		return {
			...this.params,
			vastTargeting: { passback: universalAdPackage.getType() },
			autoPlay: this.isAutoPlayEnabled(),
			container: this.createPlayerContainer(),
			hideWhenPlaying: this.params.videoPlaceholderElement,
		};
	}

	private createPlayerContainer(): HTMLDivElement {
		const playerContainer = Porvata.createVideoContainer(this.adSlot.getElement());

		playerContainer.parentElement.classList.add('hide');

		return playerContainer;
	}

	private isAutoPlayEnabled(): boolean {
		const isResolvedState = !resolvedState.isResolvedState(this.params);
		const defaultStateAutoPlay = this.params.autoPlay && !isResolvedState;
		const resolvedStateAutoPlay = this.params.resolvedStateAutoPlay && isResolvedState;

		return Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
	}
}
