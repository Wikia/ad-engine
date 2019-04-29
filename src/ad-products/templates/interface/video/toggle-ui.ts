import { utils } from '@wikia/ad-engine';

const overlayTimeout = 5000;

function add(video, container, params) {
	let timeout = null;
	let isFading = false;

	const isMobile = utils.client.isSmartphone() || utils.client.isTablet();
	const overlay = document.createElement('div');
	const panel = document.getElementsByClassName('dynamic-panel')[0] as HTMLElement;
	const setAutomaticToggle = () => {
		timeout = setTimeout(() => {
			if (video.isPlaying()) {
				video.container.classList.remove('ui-visible');
			}
		}, overlayTimeout);
	};

	function fadeOut(): void {
		isFading = true;
		setTimeout(() => fadeOutEffect(overlay), 3000);
		setTimeout(() => fadeOutEffect(panel), 3000);
		setTimeout(() => {
			if (isFading && overlay.style.opacity === '0' && panel.style.opacity === '0') {
				video.container.classList.remove('ui-visible');
			}
		}, 4000);
	}

	function fadeOutEffect(element: HTMLElement): void {
		const fadeEffect = setInterval(() => {
			if (!element.style.opacity) {
				element.style.opacity = '1';
			}
			if (isFading && parseFloat(element.style.opacity) > 0) {
				element.style.opacity = (parseFloat(element.style.opacity) - 0.01).toString();
			} else {
				clearInterval(fadeEffect);
			}
		}, 10);
	}

	function resetFadeOut(): void {
		isFading = false;
		overlay.style.opacity = '1';
		panel.style.opacity = '1';
	}

	overlay.classList.add('toggle-ui-overlay');
	if (isMobile) {
		overlay.addEventListener('click', () => {
			video.container.classList.toggle('ui-visible');

			clearTimeout(timeout);
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
