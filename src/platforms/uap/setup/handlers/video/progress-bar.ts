import { PorvataPlayer } from './porvata/porvata-player';

interface ProgressBarElement extends HTMLDivElement {
	pause?: () => void;
	reset?: () => void;
	rewind?: () => void;
	start?: () => void;
}

export class ProgressBar {
	private static forceRepaint(domElement: HTMLElement): number {
		return domElement.offsetWidth;
	}

	static add(
		video: Pick<PorvataPlayer, 'getRemainingTime' | 'addEventListener'>,
		container: HTMLElement,
	): void {
		const progressBar: ProgressBarElement = document.createElement('div');
		const currentTime: HTMLDivElement = document.createElement('div');

		progressBar.classList.add('progress-bar');
		currentTime.classList.add('current-time');

		progressBar.appendChild(currentTime);

		progressBar.pause = () => {
			currentTime.style.width = `${(currentTime.offsetWidth / progressBar.offsetWidth) * 100}%`;
		};
		progressBar.reset = () => {
			currentTime.style.transitionDuration = '';
			currentTime.style.width = '0';
		};
		progressBar.rewind = () => {
			const remainingTime: string = currentTime.style.transitionDuration;

			progressBar.reset();
			ProgressBar.forceRepaint(currentTime);
			currentTime.style.transitionDuration = remainingTime;
		};
		progressBar.start = () => {
			const remainingTime: number = video.getRemainingTime();

			if (remainingTime) {
				if (remainingTime > 0) {
					currentTime.style.transitionDuration = `${remainingTime}s`;
				}
				ProgressBar.forceRepaint(currentTime);
				currentTime.style.width = '100%';
			} else {
				currentTime.style.width = '0';
			}
		};

		video.addEventListener('wikiaAdPlay', progressBar.start);
		video.addEventListener('wikiaAdCompleted', progressBar.reset);
		video.addEventListener('wikiaAdRestart', progressBar.rewind);
		video.addEventListener('wikiaAdPause', progressBar.pause);

		container.appendChild(progressBar);
	}
}
