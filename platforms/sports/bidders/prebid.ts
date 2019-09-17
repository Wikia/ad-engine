import { DeviceMode, getDeviceMode, getWikiaContext } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { getAppNexusContext } from './prebid/app-nexus';
import { getOpenXContext } from './prebid/openx';
import { getPubmaticContext } from './prebid/pubmatic';
import { getRubiconContext } from './prebid/rubicon';

export function setPrebidAdaptersConfig(): void {
	const mode: DeviceMode = getDeviceMode();

	context.set('bidders.prebid.appnexus', getAppNexusContext(mode));
	context.set('bidders.prebid.openx', getOpenXContext(mode));
	context.set('bidders.prebid.pubmatic', getPubmaticContext(mode));
	context.set('bidders.prebid.rubicon_display', getRubiconContext(mode));
	context.set('bidders.prebid.wikia', getWikiaContext(mode));
}
