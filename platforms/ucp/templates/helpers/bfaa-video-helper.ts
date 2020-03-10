import { AdSlot, DomManipulator, Porvata4Player, UapParams } from '@wikia/ad-engine';

export class BfaaVideoHelper {
	constructor(
		private manipulator: DomManipulator,
		private params: UapParams,
		private adSlot: AdSlot,
	) {}

	/**
	 */
	setVideoImpactSize(video: Porvata4Player): void {
		if (!video.isFullscreen()) {
			const slotHeight = this.adSlot.getElement().offsetHeight;
			const slotWidth = this.adSlot.getElement().offsetWidth;

			const slotResolvedHeight = slotWidth / this.params.config.aspectRatio.resolved;
			const slotDefaultHeight = slotWidth / this.params.config.aspectRatio.default;

			/* changes between 0 (impact, full height) to 1 (resolved size);
			 * used to make video height transition smooth between
			 * this.params.config.state.height.default
			 * and this.params.config.state.height.resolved
			 */
			const progress = window.scrollY / (slotDefaultHeight - slotResolvedHeight);

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

	setVideoResolvedSize(video: Porvata4Player): void {
		if (!video.isFullscreen()) {
			const slotHeight = this.adSlot.getElement().offsetHeight;
			const margin = (100 - this.params.config.state.height.resolved) / 2;
			const height = slotHeight * (this.params.config.state.height.resolved / 100);
			const width = height * this.params.videoAspectRatio;

			this.setVideoSize(video, width, height, margin);
		}
	}

	setVideoSize(video: Porvata4Player, width: number, height: number, margin: number): void {
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
}
