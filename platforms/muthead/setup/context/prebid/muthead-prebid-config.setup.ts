import { DeviceMode, getDeviceMode, getWikiaContext, PrebidConfigSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getAppNexusContext } from '../../../bidders/prebid/app-nexus';
import { getIndexExchangeContext } from '../../../bidders/prebid/index-exchange';
import { getNobidContext } from '../../../bidders/prebid/nobid';
import { getOpenXContext } from '../../../bidders/prebid/openx';
import { getPubmaticContext } from '../../../bidders/prebid/pubmatic';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';
import { getTripleliftContext } from '../../../bidders/prebid/triplelift';

@Injectable()
export class MutheadPrebidConfigSetup implements PrebidConfigSetup {
	execute(): void {
		const mode: DeviceMode = getDeviceMode();

		context.set('bidders.prebid.appnexus', getAppNexusContext(mode));
		context.set('bidders.prebid.indexExchange', getIndexExchangeContext(mode));
		context.set('bidders.prebid.nobid', getNobidContext(mode));
		context.set('bidders.prebid.openx', getOpenXContext(mode));
		context.set('bidders.prebid.pubmatic', getPubmaticContext(mode));
		context.set('bidders.prebid.rubicon_display', getRubiconContext(mode));
		context.set('bidders.prebid.triplelift', getTripleliftContext(mode));
		context.set('bidders.prebid.wikia', getWikiaContext(mode));
	}
}
