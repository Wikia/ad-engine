import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpHydraPlatform } from './ucp-hydra-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(UcpHydraPlatform);

	platform.execute();
});
