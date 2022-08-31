import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpDesktopPlatform } from './ucp-desktop-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(UcpDesktopPlatform);

	platform.execute();
});

setTimeout(() => {
	window.scroll({
		top: 500,
		behavior: 'smooth',
	});

	const shadow = document.createElement('div');
	shadow.className = 'dsShadow';
	document.body.prepend(shadow);

	const tentacle1 = document.createElement('img');
	tentacle1.src = 'https://i.imgur.com/fzCV3fJ.png';
	tentacle1.className = 'dsTent1';
	document.body.prepend(tentacle1);

	setTimeout(() => {
		shadow.style.opacity = '1';
		tentacle1.style.top = '0';
		tentacle1.style.left = '0';
	}, 100);
}, 5000);
