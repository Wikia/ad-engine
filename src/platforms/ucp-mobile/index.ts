import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpMobilePlatform } from './ucp-mobile-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(
	withSentry((container: Container) => {
		const platform = container.get(UcpMobilePlatform);

		platform.execute();
	}),
);
