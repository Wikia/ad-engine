import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getGamepediaAppNexusContext } from '../../bidders/gamepedia/app-nexus';
import { getGamepediaIndexExchangeContext } from '../../bidders/gamepedia/index-exchange';
import { getGamepediaNobidContext } from '../../bidders/gamepedia/nobid';
import { getGamepediaPubmaticContext } from '../../bidders/gamepedia/pubmatic';
import { getGamepediaRubiconContext } from '../../bidders/gamepedia/rubicon';
import { getGamepediaTripleliftContext } from '../../bidders/gamepedia/triplelift';
import { getWikiaContext } from '../../bidders/wikia-adapter';
import { DeviceMode, getDeviceMode } from '../../models/device-mode';

@Injectable()
export class UcpGamepediaPrebidConfigSetup implements DiProcess {
	execute(): void {
		const mode: DeviceMode = getDeviceMode();

		context.set('bidders.prebid.appnexus', getGamepediaAppNexusContext(mode));
		context.set('bidders.prebid.indexExchange', getGamepediaIndexExchangeContext(mode));
		context.set('bidders.prebid.nobid', getGamepediaNobidContext(mode));
		context.set('bidders.prebid.pubmatic', getGamepediaPubmaticContext(mode));
		context.set('bidders.prebid.rubicon_display', getGamepediaRubiconContext(mode));
		context.set('bidders.prebid.triplelift', getGamepediaTripleliftContext(mode));
		context.set('bidders.prebid.wikia', getWikiaContext(mode));
	}
}
