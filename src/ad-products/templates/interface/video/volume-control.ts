import { createIcon, icons } from '../icons';

function createVolumeControl(params) {
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

function updateCurrentState(video, volumeControl) {
	if (video.isMuted() || video.isMobilePlayerMuted()) {
		volumeControl.classList.add('is-on');
	} else {
		volumeControl.classList.remove('is-on');
	}

	if (!video.isMobilePlayerMuted() && video.mobileVideoAd && video.mobileVideoAd.muted) {
		video.updateVideoDOMElement(video.defaultVolume);
	}
}

function add(video, container) {
	const volumeControl = createVolumeControl(video.params);

	video.addEventListener('wikiaVolumeChange', () => {
		updateCurrentState(video, volumeControl);
	});

	video.addEventListener('wikiaAdStarted', () => {
		updateCurrentState(video, volumeControl);
	});

	volumeControl.addEventListener('click', (e) => {
		video.volumeToggle();
		e.preventDefault();
	});

	container.appendChild(volumeControl);
}

export default {
	add,
};
