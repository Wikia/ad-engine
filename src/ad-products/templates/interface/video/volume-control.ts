import { createIcon, icons } from '../icons';

function createVolumeControl(params): HTMLDivElement {
	const iconPrefix = params.theme === 'hivi' ? 'HIVI_' : '';
	const volume = document.createElement('div');
	const offIcon = createIcon(icons[`${iconPrefix}VOLUME_OFF`], [
		'volume-off-icon',
		'porvata-icon',
		'porvata-off-icon',
	]);
	const onIcon = createIcon(icons[`${iconPrefix}VOLUME_ON`], [
		'volume-on-icon',
		'porvata-icon',
		'porvata-on-icon',
	]);

	volume.className = 'volume-button porvata-switchable-icon';
	volume.appendChild(offIcon);
	volume.appendChild(onIcon);

	return volume;
}

function updateCurrentState(video, volumeControl): void {
	if (video.isMuted()) {
		volumeControl.classList.add('is-on');
	} else {
		volumeControl.classList.remove('is-on');
	}
}

function add(video, container): void {
	const volumeControl = createVolumeControl(video.videoSettings.getParams());

	video.addEventListener('wikiaVolumeChange', () => {
		updateCurrentState(video, volumeControl);
	});

	video.addEventListener('wikiaAdStarted', () => {
		updateCurrentState(video, volumeControl);
	});

	volumeControl.addEventListener('click', (e) => {
		video.toggleVolume();
		e.preventDefault();
	});

	container.appendChild(volumeControl);
}

export default {
	add,
};
