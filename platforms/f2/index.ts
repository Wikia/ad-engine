import { adEngineConfigured, bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { basicContext } from './ad-context';
import { setupF2Ioc } from './setup-f2-ioc';
import './styles.scss';

setupPostQuecast();

const load = async () => {
	const communicator = new Communicator();

	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupF2Ioc(),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: false });

	communicator.dispatch(adEngineConfigured());

	platformStartup.run();
};

load();
