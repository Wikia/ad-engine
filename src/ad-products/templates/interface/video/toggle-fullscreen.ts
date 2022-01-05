import { createIcon, icons } from '../icons';

export class ToggleFullscreen {
	static add(video, container): void {
		const toggleFullscreenButton = document.createElement('div');
		const offIcon = createIcon(icons.FULLSCREEN_OFF, [
			'fullscreen-off-icon',
			'porvata-icon',
			'porvata-off-icon',
		]);
		const onIcon = createIcon(icons.FULLSCREEN_ON, [
			'fullscreen-emit-icon',
			'porvata-icon',
			'porvata-emit-icon',
		]);

		toggleFullscreenButton.appendChild(offIcon);
		toggleFullscreenButton.appendChild(onIcon);

		toggleFullscreenButton.className = 'toggle-fullscreen-button porvata-switchable-icon';
		toggleFullscreenButton.addEventListener('click', () => {
			video.toggleFullscreen();
		});
		video.addEventListener('wikiaFullscreenChange', () => {
			if (video.isFullscreen()) {
				toggleFullscreenButton.classList.add('is-emit');
			} else {
				toggleFullscreenButton.classList.remove('is-emit');
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
