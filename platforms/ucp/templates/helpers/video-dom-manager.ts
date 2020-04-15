import { AdSlot, Porvata4Player, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from './manipulators/dom-manipulator';

@Injectable({ autobind: false })
export class VideoDomManager {
	constructor(
		private manipulator: DomManipulator,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(TEMPLATE.SLOT) private adSlot: AdSlot,
	) {}

	setVideoSizeResolved(video: Porvata4Player): void {
		return this.setVideoSizeProgressive(video, 1);
	}

	setVideoSizeImpact(video: Porvata4Player): void {
		return this.setVideoSizeProgressive(video, 0);
	}

	setVideoSizeImpactToResolved(video: Porvata4Player): void {
		return this.setVideoSizeProgressive(video, this.getImpactProgress());
	}

	/**
	 * Sets video size.
	 *
	 * Scales from impact to default ratio during scroll.
	 *
	 * @param video Porvata video
	 * @param progress if provided then this value is used instead of calculated progress
	 */
	private setVideoSizeProgressive(video: Porvata4Player, progress: number): void {
		if (video.isFullscreen()) {
			return;
		}

		const slotHeight = this.adSlot.getElement().offsetHeight;

		const heightMultiplier =
			this.params.config.state.height.default +
			progress *
				(this.params.config.state.height.resolved - this.params.config.state.height.default);

		const margin = (100 - heightMultiplier) / 2;
		const height = (slotHeight * heightMultiplier) / 100;
		const width = height * this.params.videoAspectRatio;

		this.setVideoSize(video, width, height, margin);
	}

	/**
	 * Progress changes between 0 (impact, full height) to 1 (resolved size);
	 * used to make video height transition smooth between
	 * this.params.config.state.height.default
	 * and this.params.config.state.height.resolved
	 */
	private getImpactProgress(): number {
		const slotWidth = this.adSlot.getElement().offsetWidth;
		const slotResolvedHeight = slotWidth / this.params.config.aspectRatio.resolved;
		const slotDefaultHeight = slotWidth / this.params.config.aspectRatio.default;

		return window.scrollY / (slotDefaultHeight - slotResolvedHeight);
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
}
