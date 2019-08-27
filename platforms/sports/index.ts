import { bootstrapAndGetCmpConsent } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { basicContext } from './ad-context';
import { setupAdEngine } from './setup-ad-engine';
import './styles.scss';

async function start(): Promise<void> {
	context.extend(basicContext);

	const consent: boolean = await bootstrapAndGetCmpConsent();

	setupAdEngine(consent);
}

start();
