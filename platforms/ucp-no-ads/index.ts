import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpNoAdsPlatform } from './ucp-no-ads-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(UcpNoAdsPlatform);

	platform.execute();
});
