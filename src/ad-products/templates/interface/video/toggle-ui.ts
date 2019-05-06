import { utils } from '@wikia/ad-engine';

const overlayTimeout = 5000;

function add(video, container, params) {
	let removeVisibilityTimeout = null;
	let fadeOutTimeout = null;

	const isMobile = utils.client.isSmartphone() || utils.client.isTablet();
	const overlay = document.createElement('div');
	const panel = document.getElementsByClassName('dynamic-panel')[0] as HTMLElement;
	const setAutomaticToggle = () => {
		removeVisibilityTimeout = setTimeout(() => {
			if (video.isPlaying()) {
				video.container.classList.remove('ui-visible');
			}
		}, overlayTimeout);
	};

	function fadeOut(): void {
		fadeOutTimeout = setTimeout(() => {
			overlay.classList.add('fading');
			panel.classList.add('fading');
		}, 3000);
		removeVisibilityTimeout = setTimeout(() => {
			video.container.classList.remove('ui-visible');
		}, 4000);
	}

	function resetFadeOut(): void {
		clearTimeout(removeVisibilityTimeout);
		clearTimeout(fadeOutTimeout);
		overlay.classList.remove('fading');
		panel.classList.remove('fading');
	}

	overlay.classList.add('toggle-ui-overlay');
	if (isMobile) {
		overlay.addEventListener('click', () => {
			video.container.classList.toggle('ui-visible');

			clearTimeout(removeVisibilityTimeout);
			setAutomaticToggle();
		});
		video.addEventListener('resume', setAutomaticToggle);
	} else {
		video.container.addEventListener('mouseenter', () => {
			video.container.classList.add('ui-visible');
			resetFadeOut();
		});
		video.container.addEventListener('mouseleave', () => {
			fadeOut();
		});
		overlay.addEventListener('click', () => {
			top.open(params.clickThroughURL, '_blank');
		});
	}

	container.appendChild(overlay);
}

export default {
	add,
};
