import { createIcon, icons } from '../icons';

function add(video, container): void {
	const pauseButton = document.createElement('div');
	const pauseIcon = createIcon(icons.PAUSE, ['play-off-icon', 'porvata-icon', 'porvata-off-icon']);
	const playIcon = createIcon(icons.PLAY, ['play-emit-icon', 'porvata-icon', 'porvata-emit-icon']);

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
		pauseButton.classList.remove('is-emit');
	});
	video.addEventListener('resume', () => {
		pauseButton.classList.add('is-emit');
	});
	video.addEventListener('start', () => {
		pauseButton.classList.add('is-emit');
	});

	container.appendChild(pauseButton);
}

export default {
	add,
};
