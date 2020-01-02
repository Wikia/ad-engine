import { PorvataPlayer, UapParams } from '../../../..';
import { CloseButton } from '../../../interface/close-button';

export class HiviBfaa2Ui {
	closeButton: HTMLElement;

	constructor(private gamParams: UapParams) {}

	switchImagesInAd(isResolved: boolean): void {
		if (this.gamParams.image2 && this.gamParams.image2.background) {
			if (isResolved) {
				this.gamParams.image2.element.classList.remove('hidden-state');
				this.gamParams.image1.element.classList.add('hidden-state');
			} else {
				this.gamParams.image2.element.classList.add('hidden-state');
				this.gamParams.image1.element.classList.remove('hidden-state');
			}
		} else {
			this.gamParams.image1.element.classList.remove('hidden-state');
		}
	}

	updateVideoSize(video: PorvataPlayer | undefined, width: number): void {
		if (!video.isFullscreen()) {
			video.container.style.width = `${width}px`;
		}
	}

	setVideoStyle(video: PorvataPlayer, style: object): void {
		Object.assign(video.container.style, style);

		if (video.isFullscreen()) {
			video.container.style.height = '100%';
		}
	}
	setBodyPaddingTop(padding: string): void {
		document.body.style.paddingTop = padding;
	}

	addCloseButton(element: HTMLElement, onClick: () => void): void {
		if (!this.closeButton) {
			this.closeButton = new CloseButton({
				classNames: ['button-unstick'],
				onClick,
			}).render();

			element.appendChild(this.closeButton);
		}
	}

	removeCloseButton(): void {
		if (this.closeButton) {
			this.closeButton.remove();
			delete this.closeButton;
		}
	}
}
