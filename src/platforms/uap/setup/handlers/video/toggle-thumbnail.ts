export class ToggleThumbnail {
	static add(video, container, params): void {
		video.addEventListener('wikiaAdStarted', () => {
			params.thumbnail.classList.add('hidden-state');
		});

		video.addEventListener('wikiaAdCompleted', () => {
			params.thumbnail.classList.remove('hidden-state');
		});
	}
}
