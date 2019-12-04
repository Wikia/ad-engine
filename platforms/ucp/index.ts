import { bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { setupUcpIoc } from './setup-ucp-ioc';
import './styles.scss';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupUcpIoc(),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: false });
	platformStartup.run();
});
