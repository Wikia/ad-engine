import { createIcon, icons } from '../icons';

function add(video, container): void {
	const pauseButton = document.createElement('div');
	const pauseIcon = createIcon(icons.PAUSE, ['play-off-icon', 'porvata-icon', 'porvata-off-icon']);
	const playIcon = createIcon(icons.PLAY, ['play-on-icon', 'porvata-icon', 'porvata-on-icon']);

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

export default {
	add,
};
