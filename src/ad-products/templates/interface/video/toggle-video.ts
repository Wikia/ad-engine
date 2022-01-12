export class ToggleVideo {
	static add(video, container): void {
		video.addEventListener('wikiaAdStarted', () => {
			container.classList.remove('hide');
		});

		video.addEventListener('wikiaAdCompleted', () => {
			container.classList.add('hide');
		});
	}
}
