import {
	bootstrapAndGetConsent,
	ensureGeoCookie,
	mediaWikiWrapper,
	PlatformStartup,
} from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { setupGamepediaIoc } from './setup-gamepedia-ioc';
import './styles.scss';

const load = async () => {
	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupGamepediaIoc(),
		ensureGeoCookie().then(() => bootstrapAndGetConsent()),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: !utils.client.isDesktop() });
	platformStartup.run();
};

mediaWikiWrapper.ready.then(load);
