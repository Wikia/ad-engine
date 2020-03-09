import { AdSlot, DomManipulator, Porvata4Player, UapParams } from '@wikia/ad-engine';

export class BfaaVideoHelper {
	constructor(
		private manipulator: DomManipulator,
		private params: UapParams,
		private adSlot: AdSlot,
	) {}

	/**
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

			video.resize(width, height);

			const videoOverlay = video.dom.getPlayerContainer().parentElement;

			this.manipulator.element(videoOverlay).setProperty('width', `${width}px`);
			this.manipulator.element(videoOverlay).setProperty('height', `${height}px`);
			this.manipulator.element(videoOverlay).setProperty('top', `${margin}%`);
		}
	}

	getImpactProgress(): number {
		const slotWidth = this.adSlot.getElement().offsetWidth;
		const slotResolvedHeight = slotWidth / this.params.config.aspectRatio.resolved;
		const slotDefaultHeight = slotWidth / this.params.config.aspectRatio.default;

		/* changes between 0 (impact, full height) to 1 (resolved size);
		 * used to make video height transition smooth between
		 * this.params.config.state.height.default
		 * and this.params.config.state.height.resolved
		 */
		return window.scrollY / (slotDefaultHeight - slotResolvedHeight);
	}

	setVideoResolvedSize(video: Porvata4Player): void {
		if (!video.isFullscreen()) {
			const slotHeight = this.adSlot.getElement().offsetHeight;
			const margin = (100 - this.params.config.state.height.resolved) / 2;
			const height = slotHeight * (this.params.config.state.height.resolved / 100);
			const width = height * this.params.videoAspectRatio;

			video.resize(width, height);

			const videoOverlay = video.dom.getPlayerContainer().parentElement;

			this.manipulator.element(videoOverlay).setProperty('width', `${width}px`);
			this.manipulator.element(videoOverlay).setProperty('height', `${height}px`);
			this.manipulator.element(videoOverlay).setProperty('top', `${margin}%`);
		}
	}
}
