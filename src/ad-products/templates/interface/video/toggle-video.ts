import { AdSlot } from '@ad-engine/core';

export class ToggleVideo {
	static add(video, container): void {
		video.addEventListener('wikiaAdStarted', () => {
			container.classList.remove(AdSlot.HIDDEN_AD_CLASS);
		});

		video.addEventListener('wikiaAdCompleted', () => {
			container.classList.add(AdSlot.HIDDEN_AD_CLASS);
		});
	}
}
