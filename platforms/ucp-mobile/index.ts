import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpMobilePlatform } from './ucp-mobile-platform';

function uncollapseSections(): void {
	const headers = document
		.querySelector('.article-content')
		.querySelectorAll('h1[section],h2[section]');

	for (const header of headers as any) {
		const section = header.nextElementSibling;
		let visible = 'false';

		if (header.classList.toggle('open-section')) {
			visible = 'true';
		}

		section.setAttribute('aria-pressed', visible);
		section.setAttribute('aria-expanded', visible);
	}
}

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(UcpMobilePlatform);

	uncollapseSections();

	platform.execute();
});
