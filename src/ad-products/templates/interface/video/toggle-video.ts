import { HIDDEN_AD_CLASS } from '@ad-engine/core';

export class ToggleVideo {
	static add(video, container): void {
		video.addEventListener('wikiaAdStarted', () => {
			container.classList.remove(HIDDEN_AD_CLASS);
		});

		video.addEventListener('wikiaAdCompleted', () => {
			container.classList.add(HIDDEN_AD_CLASS);
		});
	}
}
