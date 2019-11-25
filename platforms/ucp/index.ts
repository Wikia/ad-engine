import { bootstrapAndGetCmpConsent, PlatformStartup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { setupUcpIoc } from './setup-ucp-ioc';
import './styles.scss';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	context.extend(basicContext);

	const [consent, container]: [boolean, Container] = await Promise.all([
		bootstrapAndGetCmpConsent(),
		setupUcpIoc(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isOptedIn: consent, isMobile: false });
	platformStartup.run();
});
