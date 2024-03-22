import { getVolumeOffHiviIcon } from "../../../../../ad-products/templates/interface/icons/volueme-off-hivi";
import { getVolumeOnHiviIcon } from "../../../../../ad-products/templates/interface/icons/volueme-on-hivi";

function createVolumeControl(): HTMLDivElement {
	const volume = document.createElement('div');
	const offIcon = getVolumeOffHiviIcon([
		'volume-off-icon',
		'porvata-icon',
		'porvata-off-icon',
	]);
	const onIcon = getVolumeOnHiviIcon([
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

export class VolumeControl {
	static add(video, container): void {
		const volumeControl = createVolumeControl();

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
}
