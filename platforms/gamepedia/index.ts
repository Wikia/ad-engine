import { bootstrapAndGetCmpConsent, ensureGeoCookie } from '@platforms/shared';
import { context, utils } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { PlatformStartup } from '../shared/platform-startup';
import { basicContext } from './ad-context';
import { setupGamepediaIoc } from './setup-gamepedia-ioc';
import './styles.scss';

// RLQ may not exist as AdEngine is loading independently from Resource Loader
window.RLQ = window.RLQ || [];

const load = async () => {
	context.extend(basicContext);

	const [consent, container]: [boolean, Container, ...any[]] = await Promise.all([
		ensureGeoCookie().then(() => bootstrapAndGetCmpConsent()),
		setupGamepediaIoc(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isOptedIn: consent, isMobile: !utils.client.isDesktop() });
	platformStartup.run();
};

window.RLQ.push(() => {
	// AdEngine has to wait for Track extension
	/*
	 mw.loader.using is no longer available in MediaWiki 1.33
	 Remove once https://gitlab.com/hydrawiki/hydra/issues/5087 is finished.
	*/
	if (window.mw.loader.using) {
		window.mw.loader.using('ext.track.scripts').then(load);
	} else {
		window.mw.loader.enqueue(['ext.track.scripts'], load);
	}
});
