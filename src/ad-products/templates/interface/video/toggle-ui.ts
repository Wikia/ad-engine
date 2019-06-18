import { utils } from '@wikia/ad-engine';

const FADE_OUT_TIMEOUT = 3000;
const FADE_OUT_ANIMATION_TIME = 1000;

function add(video, container, params) {
	let removeVisibilityTimeout: number;
	let fadeOutTimeout: number;

	const isMobile = utils.client.isSmartphone() || utils.client.isTablet();
	const overlay = document.createElement('div');
	const panel = document.getElementsByClassName('dynamic-panel')[0] as HTMLElement;

	function fadeOut(): void {
		fadeOutTimeout = window.setTimeout(() => {
			overlay.classList.add('fading');
			panel.classList.add('fading');
		}, FADE_OUT_TIMEOUT);

		removeVisibilityTimeout = window.setTimeout(() => {
			video.container.classList.remove('ui-visible');
		}, FADE_OUT_TIMEOUT + FADE_OUT_ANIMATION_TIME);
	}

	function resetFadeOut(): void {
		clearTimeout(removeVisibilityTimeout);
		clearTimeout(fadeOutTimeout);

		overlay.classList.remove('fading');
		panel.classList.remove('fading');
	}

	overlay.classList.add('toggle-ui-overlay');
	video.addEventListener('start', () => {
		video.container.classList.add('ui-visible');
		resetFadeOut();
		fadeOut();
	});

	if (isMobile) {
		overlay.addEventListener('click', () => {
			video.container.classList.toggle('ui-visible');
			resetFadeOut();

			if (video.isPlaying()) {
				fadeOut();
			}
		});

		video.addEventListener('resume', fadeOut);
		video.addEventListener('pause', resetFadeOut);
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
