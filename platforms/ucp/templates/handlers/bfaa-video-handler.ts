import {
	AdSlot,
	Porvata,
	resolvedState,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
	videoUIElements,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BfaaVideoHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
	) {}

	async onEnter(): Promise<void> {
		this.adSlot.addClass('theme-hivi'); // Required by replay-overlay
		const params = { ...this.params };
		const width: number = params.videoPlaceholderElement.offsetWidth;
		const height = width / params.videoAspectRatio;

		params.vastTargeting = { passback: universalAdPackage.getType() };
		params.width = width;
		params.height = height;

		const isResolvedState = !resolvedState.isResolvedState(this.params);
		const defaultStateAutoPlay = params.autoPlay && !isResolvedState;
		const resolvedStateAutoPlay = params.resolvedStateAutoPlay && isResolvedState;

		params.autoPlay = Boolean(defaultStateAutoPlay || resolvedStateAutoPlay);

		Porvata.createVideoContainer(this.adSlot.getElement());

		Porvata.inject(params).then((video) => {
			video.addEventListener('wikiaAdStarted', () => {
				if (!video.isFullscreen()) {
					// TODO: Split setting height to default and impact
					const slotHeight = this.adSlot.getElement().offsetHeight;
					const margin = (slotHeight * (100 - params.config.state.height.default)) / 2 / 100;

					video.dom.getVideoContainer().style.width = `${(params.config.state.height.default /
						100) *
						this.params.videoAspectRatio *
						slotHeight}px`;
					video.dom.getVideoContainer().style.height = `${params.config.state.height.default}%`;
					video.dom.getVideoContainer().style.top = `${margin}px`;
					video.dom.getVideoContainer().style.right = `${margin}px`; // TODO: Use 23.2%
				}
			});

			// videoUIElements.ProgressBar.add(video, video.dom.getInterfaceContainer()); // TODO: Add ProgressBar
			// createBottomPanel({ fullscreenAllowed: params.fullscreenAllowed, theme: 'hivi' });  // TODO: Add createBottomPanel
			// videoUIElements.ToggleUI.add(video, interfaceContainer, params);  // TODO: Add ToggleUI
			// videoUIElements.LearnMore.add(video, playerContainer, params); // TODO: Add LearnMore
			videoUIElements.ToggleVideo.add(video, video.dom.getVideoContainer());
			videoUIElements.ToggleThumbnail.add(video, undefined, params);
			videoUIElements.ReplayOverlay.add(video, video.dom.getVideoContainer(), params);
		});
	}

	async onLeave(): Promise<void> {}
}
