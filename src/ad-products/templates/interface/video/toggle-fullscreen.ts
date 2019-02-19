import { createIcon, icons } from '../icons';

function add(video, container) {
	const toggleFullscreenButton = document.createElement('div');
	const offIcon = createIcon(icons.FULLSCREEN_OFF, [
		'fullscreen-off-icon',
		'porvata-icon',
		'porvata-off-icon',
	]);
	const onIcon = createIcon(icons.FULLSCREEN_ON, [
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

export default {
	add,
};
