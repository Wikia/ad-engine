import { DeviceMode, getDeviceMode, getWikiaContext } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { getAppNexusContext } from './prebid/app-nexus';
import { getIndexExchangeContext } from './prebid/index-exchange';
import { getOpenXContext } from './prebid/openx';
import { getPubmaticContext } from './prebid/pubmatic';
import { getRubiconContext } from './prebid/rubicon';

export function setPrebidAdaptersConfig(app: string): void {
	const mode: DeviceMode = getDeviceMode();

	context.set('bidders.prebid.appnexus', getAppNexusContext(app, mode));
	context.set('bidders.prebid.indexExchange', getIndexExchangeContext(app, mode));
	context.set('bidders.prebid.openx', getOpenXContext(app, mode));
	context.set('bidders.prebid.pubmatic', getPubmaticContext(app, mode));
	context.set('bidders.prebid.wikia', getWikiaContext(mode));

	// Temporary till we get SSP params for Futhead from Rubicon
	if (app === 'muthead') {
		context.set('bidders.prebid.rubicon_display', getRubiconContext(app, mode));
	}
}
