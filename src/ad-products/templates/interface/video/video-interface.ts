export function setup(video, container, uiElements, params): void {
	uiElements.forEach((element) => {
		if (element) {
			element.add(video, container, params);
		}
	});
}
