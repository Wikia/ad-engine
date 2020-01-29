export function setup(player, uiElements, params): void {
	uiElements.forEach((element) => {
		if (element) {
			element.add(player, player.container, params);
		}
	});
}
