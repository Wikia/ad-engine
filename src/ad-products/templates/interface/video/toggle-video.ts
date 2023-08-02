export class ToggleVideo {
	static add(video, container): void {
		video.addEventListener('wikiaAdStarted', () => {
			container.classList.remove('hidden-ad');
		});

		video.addEventListener('wikiaAdCompleted', () => {
			container.classList.add('hidden-ad');
		});
	}
}
