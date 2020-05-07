import { Porvata4Player, TEMPLATE, UapParams } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { isNumber } from 'util';
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

	private setVideoSize(video: Porvata4Player, props: UapVideoSize): void {
		video.resize(props.width, props.height);

		const videoOverlay = video.dom.getPlayerContainer().parentElement;
		const thumbnail = this.params.thumbnail;

		this.setProperties(videoOverlay, props);
		this.setProperties(thumbnail, props);
	}

	private setProperties(
		element: HTMLElement,
		{ width, height, top, right, bottom }: UapVideoSize,
	): void {
		this.manipulator.element(element).setProperty('width', `${width}px`);
		this.manipulator.element(element).setProperty('height', `${height}px`);
		if (isNumber(top)) {
			this.manipulator.element(element).setProperty('top', `${top}%`);
		}
		if (isNumber(right)) {
			this.manipulator.element(element).setProperty('right', `${right}%`);
		}
		if (isNumber(bottom)) {
			this.manipulator.element(element).setProperty('bottom', `${bottom}%`);
		}
	}
}
