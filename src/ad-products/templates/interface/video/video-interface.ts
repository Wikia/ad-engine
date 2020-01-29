import { PorvataPlayer } from '../../../video/porvata/porvata-player';

export function setup(player: PorvataPlayer, uiElements, params): void {
	uiElements.forEach((element) => {
		if (element) {
			element.add(player, player.interfaceContainer, params);
		}
	});
}
