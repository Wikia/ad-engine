import { slotTweaker } from '@ad-engine/core';

function add(video, container) {
	const progressBar = document.createElement('div');
	const currentTime = document.createElement('div');

	progressBar.classList.add('progress-bar');
	currentTime.classList.add('current-time');

	progressBar.appendChild(currentTime);

	progressBar.pause = () => {
		currentTime.style.width = `${(currentTime.offsetWidth / progressBar.offsetWidth) * 100}%`;
	};
	progressBar.reset = () => {
		currentTime.style.transitionDuration = '';
		currentTime.style.width = '0';
	};
	progressBar.rewind = () => {
		const remainingTime = currentTime.style.transitionDuration;

		progressBar.reset();
		slotTweaker.forceRepaint(currentTime);
		currentTime.style.transitionDuration = remainingTime;
	};
	progressBar.start = () => {
		const remainingTime = video.getRemainingTime();

		if (remainingTime) {
			if (remainingTime > 0) {
				currentTime.style.transitionDuration = `${remainingTime}s`;
			}
			slotTweaker.forceRepaint(currentTime);
			currentTime.style.width = '100%';
		} else {
			currentTime.style.width = '0';
		}
	};

	video.addEventListener('wikiaAdPlay', progressBar.start);
	video.addEventListener('wikiaAdCompleted', progressBar.reset);
	video.addEventListener('wikiaAdRestart', progressBar.rewind);
	video.addEventListener('wikiaAdPause', progressBar.pause);

	container.appendChild(progressBar);
}

export default {
	add,
};
