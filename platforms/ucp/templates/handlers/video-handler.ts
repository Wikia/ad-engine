import {
	AdSlot,
	createBottomPanel,
	Porvata,
	Porvata4Player,
	resolvedState,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapParams,
	universalAdPackage,
	videoUIElements,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { fromEvent } from 'rxjs';
import { skip } from 'rxjs/operators';
import { UapContext } from './uap-context';

@Injectable()
export class VideoHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.CONTEXT) private context: UapContext,
	) {}

	async onEnter(transition: TemplateTransition<'impact'>): Promise<void> {
		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		const params = { ...this.params };

		params.vastTargeting = { passback: universalAdPackage.getType() };

		const isResolvedState = !resolvedState.isResolvedState(params);
		const defaultStateAutoPlay = params.autoPlay && !isResolvedState;
		const resolvedStateAutoPlay = params.resolvedStateAutoPlay && isResolvedState;

		params.autoPlay = Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);

		const playerContainer = Porvata.createVideoContainer(this.adSlot.getElement());
		playerContainer.parentElement.classList.add('hide');

		let videoLoaded: (player: Porvata4Player) => void;

		this.context.video = new Promise<Porvata4Player>((res) => {
			videoLoaded = res;
		});

		const playerParams = {
			...params,
			container: playerContainer,
			hideWhenPlaying: params.videoPlaceholderElement,
		};

		Porvata.inject(playerParams).then((video) => {
			videoLoaded(video);

			const started$ = fromEvent(video, 'wikiaAdStarted');

			// Transition to impact when video is restarted
			started$.pipe(skip(1)).subscribe(() => {
				transition('impact', { allowMulticast: true });
				video.unmute();
			});

			video.addEventListener('adCanPlay', () => {
				video.dom.getVideoContainer().classList.remove('hide');
			});
			video.addEventListener('wikiaAdStarted', () => {
				video.addEventListener('wikiaAdCompleted', () => {
					video.reload();
				});
			});
			videoUIElements.ProgressBar.add(video, video.dom.getInterfaceContainer());
			createBottomPanel({ fullscreenAllowed: playerParams.fullscreenAllowed, theme: 'hivi' }).add(
				video,
				video.dom.getInterfaceContainer(),
				playerParams,
			);
			videoUIElements.ToggleUI.add(video, video.dom.getInterfaceContainer(), playerParams);
			videoUIElements.ToggleVideo.add(video, playerContainer.parentElement);
			videoUIElements.ToggleThumbnail.add(video, undefined, playerParams);
			videoUIElements.ReplayOverlay.add(video, video.dom.getPlayerContainer(), playerParams);
		});
	}

	async onLeave(): Promise<void> {}
}
