import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpPlatform } from './ucp-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(UcpPlatform);

	platform.execute();
});
