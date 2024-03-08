import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpNoAdsPlatform } from './ucp-no-ads-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(
	withSentry((container: Container) => {
		const platform = container.get(UcpNoAdsPlatform);

		platform.execute();
	}),
);
