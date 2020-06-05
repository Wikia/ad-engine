import { adEngineConfigured, bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { context, eventService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { setupMinervaIoc } from './setup-minerva-ioc';
import './styles.scss';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupMinervaIoc(),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: true });

	// TODO: Move it to platformStartup.run once all platforms use @wikia/post-quecast
	eventService.communicator.dispatch(adEngineConfigured());

	platformStartup.run();
});
