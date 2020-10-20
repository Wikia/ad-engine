import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpMercuryPlatform } from './ucp-mercury-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(UcpMercuryPlatform);

	platform.execute();
});
