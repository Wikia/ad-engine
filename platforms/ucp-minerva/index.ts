import { adEngineConfigured, bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { basicContext } from './ad-context';
import { setupMinervaIoc } from './setup-minerva-ioc';
import './styles.scss';

setupPostQuecast();

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const communicator = new Communicator();
	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupMinervaIoc(),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: true });

	// TODO: Move it to platformStartup.run once all platforms use @wikia/post-quecast
	communicator.dispatch(adEngineConfigured());

	platformStartup.run();
});
