import { bootstrapAndGetCmpConsent, getDeviceMode, PlatformStartup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { basicContext } from './ad-context';
import { setupMutheadIoc } from './setup-muthead-ioc';
import './styles.scss';

async function start(): Promise<void> {
	context.extend(basicContext);

	const [consent, container]: [boolean, Container] = await Promise.all([
		bootstrapAndGetCmpConsent(),
		setupMutheadIoc(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isOptedIn: consent, isMobile: getDeviceMode() === 'mobile' });
	platformStartup.run();
}

start();
