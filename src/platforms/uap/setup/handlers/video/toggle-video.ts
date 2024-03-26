import { AdSlotClass } from "../../../../../core/models/ad-slot-class";

export class ToggleVideo {
	static add(video, container): void {
		video.addEventListener('wikiaAdStarted', () => {
			container.classList.remove(AdSlotClass.HIDDEN_AD_CLASS);
		});

		video.addEventListener('wikiaAdCompleted', () => {
			container.classList.add(AdSlotClass.HIDDEN_AD_CLASS);
		});
	}
}
