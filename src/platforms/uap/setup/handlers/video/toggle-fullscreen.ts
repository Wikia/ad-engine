import { getFullscreenOnIcon } from "../../../../../ad-products/templates/interface/icons/fullscreen-on";
import { getFullscreenOffIcon } from "../../../../../ad-products/templates/interface/icons/fullscreen-off";

export class ToggleFullscreen {
	static add(video, container): void {
		const toggleFullscreenButton = document.createElement('div');
		const offIcon = getFullscreenOffIcon([
			'fullscreen-off-icon',
			'porvata-icon',
			'porvata-off-icon',
		]);
		const onIcon = getFullscreenOnIcon([
			'fullscreen-on-icon',
			'porvata-icon',
			'porvata-on-icon',
		]);

		toggleFullscreenButton.appendChild(offIcon);
		toggleFullscreenButton.appendChild(onIcon);

		toggleFullscreenButton.className = 'toggle-fullscreen-button porvata-switchable-icon';
		toggleFullscreenButton.addEventListener('click', () => {
			video.toggleFullscreen();
		});
		video.addEventListener('wikiaFullscreenChange', () => {
			if (video.isFullscreen()) {
				toggleFullscreenButton.classList.add('is-on');
			} else {
				toggleFullscreenButton.classList.remove('is-on');
			}
		});
		video.addEventListener('wikiaAdStop', () => {
			if (video.isFullscreen()) {
				video.toggleFullscreen();
			}
		});

		container.appendChild(toggleFullscreenButton);
	}
}
