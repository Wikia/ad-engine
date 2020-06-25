import { adEngineConfigured, bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { babRemover, communicationService, context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { setupUcpIoc } from './setup-ucp-ioc';
import './styles.scss';

babRemover.ping();

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupUcpIoc(),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: false });

	// TODO: Move it to platformStartup.run once all platforms use @wikia/post-quecast
	communicationService.dispatch(adEngineConfigured());

	platformStartup.run();
});
