import { bootstrapAndGetCmpConsent } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { PlatformStartup } from '../shared/platform-startup';
import { basicContext } from './ad-context';
import { setupIoc } from './setup/setup-ioc';
import './styles.scss';

// RLQ may not exist as AdEngine is loading independently from Resource Loader
window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	// AdEngine has to wait for Track extension
	await window.mw.loader.using('ext.track.scripts');

	context.extend(basicContext);

	const [consent, container]: [boolean, Container] = await Promise.all([
		bootstrapAndGetCmpConsent(),
		setupIoc(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isOptedIn: consent, isMobile: !utils.client.isDesktop() });
	platformStartup.run();
});
