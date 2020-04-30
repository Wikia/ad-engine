import { Porvata4Player, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { DomManipulator } from './manipulators/dom-manipulator';
import { UapVideoSize, VideoDomReader } from './video-dom-reader';

@Injectable({ autobind: false })
export class VideoDomManager {
	constructor(
		private manipulator: DomManipulator,
		private reader: VideoDomReader,
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
	) {}

	setVideoSizeResolved(video: Porvata4Player): void {
		if (video.isFullscreen()) {
			return;
		}

		return this.setVideoSize(video, this.reader.getVideoSizeResolved());
	}

	setVideoSizeImpact(video: Porvata4Player): void {
		if (video.isFullscreen()) {
			return;
		}

		return this.setVideoSize(video, this.reader.getVideoSizeImpact());
	}

	setVideoSizeImpactToResolved(video: Porvata4Player): void {
		if (video.isFullscreen()) {
			return;
		}

		return this.setVideoSize(video, this.reader.getVideoSizeImpactToResolved());
	}

	private setVideoSize(video: Porvata4Player, { width, height, bottom }: UapVideoSize): void {
		video.resize(width, height);

		const videoOverlay = video.dom.getPlayerContainer().parentElement;

		this.manipulator
			.element(videoOverlay)
			.setProperty('width', `${width}px`)
			.setProperty('height', `${height}px`)
			.setProperty('bottom', `${bottom}%`);

		const thumbnail = this.params.thumbnail;

		this.manipulator
			.element(thumbnail)
			.setProperty('width', `${width}px`)
			.setProperty('height', `${height}px`)
			.setProperty('bottom', `${bottom}%`);
	}
}
