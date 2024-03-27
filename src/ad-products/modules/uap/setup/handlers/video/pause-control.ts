import { getPauseIcon } from "../../../../../../ad-products/templates/interface/icons/pause";
import { getPlayIcon } from "../../../../../../ad-products/templates/interface/icons/play";

export class PauseControl {
	static add(video, container): void {
		const pauseButton = document.createElement('div');
		const pauseIcon = getPauseIcon([
			'play-off-icon',
			'porvata-icon',
			'porvata-off-icon',
		]);
		const playIcon = getPlayIcon(['play-on-icon', 'porvata-icon', 'porvata-on-icon']);

		pauseButton.appendChild(playIcon);
		pauseButton.appendChild(pauseIcon);

		pauseButton.className = 'play-pause-button porvata-switchable-icon';
		pauseButton.addEventListener('click', () => {
			if (video.isPaused()) {
				video.resume();
			} else {
				video.pause();
			}
		});
		video.addEventListener('pause', () => {
			pauseButton.classList.remove('is-on');
		});
		video.addEventListener('resume', () => {
			pauseButton.classList.add('is-on');
		});
		video.addEventListener('start', () => {
			pauseButton.classList.add('is-on');
		});

		container.appendChild(pauseButton);
	}
}
