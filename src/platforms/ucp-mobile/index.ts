import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpMobilePlatform } from './ucp-mobile-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(UcpMobilePlatform);

	platform.execute();
});
