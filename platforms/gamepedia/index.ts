import { bootstrapAndGetCmpConsent } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { basicContext } from './ad-context';
import { setupAdEngine } from './setup-ad-engine';
import './styles.scss';

// RLQ may not exist as AdEngine is loading independently from Resource Loader
window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	// AdEngine has to wait for Track extension
	await window.mw.loader.using('ext.track.scripts');

	context.extend(basicContext);

	const consent: boolean = await bootstrapAndGetCmpConsent();

	setupAdEngine(consent);
});
