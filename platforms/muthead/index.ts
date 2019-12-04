import {
	bootstrapAndGetConsent,
	ensureGeoCookie,
	getDeviceMode,
	PlatformStartup,
} from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { setupMutheadIoc } from './setup-muthead-ioc';
import './styles.scss';

async function start(): Promise<void> {
	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupMutheadIoc(),
		ensureGeoCookie().then(() => bootstrapAndGetConsent()),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: getDeviceMode() === 'mobile' });
	platformStartup.run();
}

start();
