export function setup(video, uiElements, params): void {
	uiElements.forEach((element) => {
		if (element) {
			element.add(video, video.container, params);
		}
	});
}
