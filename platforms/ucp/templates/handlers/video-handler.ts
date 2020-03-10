import {
	AdSlot,
	createBottomPanel,
	Porvata,
	Porvata4Player,
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
		if (!universalAdPackage.isVideoEnabled(this.params)) {
			return;
		}
		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		const isResolvedState = !resolvedState.isResolvedState(this.params);
		const defaultStateAutoPlay = this.params.autoPlay && !isResolvedState;
		const resolvedStateAutoPlay = this.params.resolvedStateAutoPlay && isResolvedState;
		const playerContainer = Porvata.createVideoContainer(this.adSlot.getElement());

		playerContainer.parentElement.classList.add('hide');
		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		this.context.video = utils.createExtendedPromise<Porvata4Player>();
		this.params.autoPlay = Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);
		this.params.vastTargeting = { passback: universalAdPackage.getType() };

		const playerParams = {
			...this.params,
			container: playerContainer,
			hideWhenPlaying: this.params.videoPlaceholderElement,
		};

		Porvata.inject(playerParams).then((video) => {
			this.context.video.resolve(video);

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
			ProgressBar.add(video, video.dom.getInterfaceContainer());
			createBottomPanel({ fullscreenAllowed: playerParams.fullscreenAllowed, theme: 'hivi' }).add(
				video,
				video.dom.getInterfaceContainer(),
				playerParams,
			);
			ToggleUI.add(video, video.dom.getInterfaceContainer(), playerParams);
			ToggleVideo.add(video, playerContainer.parentElement);
			ToggleThumbnail.add(video, undefined, playerParams);
			ReplayOverlay.add(video, video.dom.getPlayerContainer(), playerParams);
		});
	}

	async onLeave(): Promise<void> {}
}
