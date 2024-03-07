import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { UcpDesktopPlatform } from './ucp-desktop-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(
	withSentry((container: Container) => {
		const platform = container.get(UcpDesktopPlatform);

		platform.execute();
	}),
);
