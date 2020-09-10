import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpMinervaPlatform } from './ucp-minerva-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(UcpMinervaPlatform);

	platform.execute();
});
