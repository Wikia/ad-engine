import { PorvataPlayer } from '../../../..';
import { UapParams } from '../../universal-ad-package';

export class HiviBfaa2Ui {
	switchImagesInAd(params: UapParams, isResolved: boolean): void {
		if (params.image2 && params.image2.background) {
			if (isResolved) {
				params.image2.element.classList.remove('hidden-state');
				params.image1.element.classList.add('hidden-state');
			} else {
				params.image2.element.classList.add('hidden-state');
				params.image1.element.classList.remove('hidden-state');
			}
		} else {
			params.image1.element.classList.remove('hidden-state');
		}
	}

	updateVideoSize(video: PorvataPlayer | undefined, width: number): void {
		if (video && !video.isFullscreen()) {
			video.container.style.width = `${width}px`;
		}
	}

	setVideoStyle(video: PorvataPlayer, style: object): void {
		Object.assign(video.container.style, style);

		if (video.isFullscreen()) {
			video.container.style.height = '100%';
		}
	}
}
