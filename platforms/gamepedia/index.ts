import { bootstrapAndGetConsent, ensureGeoCookie } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { PlatformStartup } from '../shared/platform-startup';
import { basicContext } from './ad-context';
import { setupGamepediaIoc } from './setup-gamepedia-ioc';
import './styles.scss';
import { mediaWikiWrapper } from './utils/media-wiki-wrapper';

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
