import { PorvataPlayer } from '../../../video/player/p/porvata-player';

function add(player: PorvataPlayer, container): void {
	const closeButton = document.createElement('div');

	closeButton.classList.add('close-ad');
	closeButton.addEventListener('click', (event) => {
		player.stop();
		event.preventDefault();
	});

	container.appendChild(closeButton);
}

export default {
	add,
};
