import {
	Bidders,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getAppnexusContext } from '../../../bidders/appnexus';
import { getCriteoContext } from '../../../bidders/criteo';
import { getIndexExchangeContext } from '../../../bidders/index-exchange';
import { getKargoContext } from '../../../bidders/kargo';
import { getMagniteS2sContext } from '../../../bidders/magniteS2s';
import { getMedianetContext } from '../../../bidders/medianet';
import { getOpenXContext } from '../../../bidders/openx';
import { getPubmaticContext } from '../../../bidders/pubmatic';
import { getRubiconDisplayContext } from '../../../bidders/rubicon-display';
import { getYahooSspContext } from '../../../bidders/yahoossp';

@Injectable()
export class MetacriticNeutronPrebidConfigSetup implements DiProcess {
	constructor(private bidders: Bidders) {}

	execute(): void {
		const isDesktop = !context.get('state.isMobile');

		context.set('bidders.prebid.appnexus', getAppnexusContext(isDesktop));
		context.set('bidders.prebid.criteo', getCriteoContext(isDesktop));
		context.set('bidders.prebid.indexExchange', getIndexExchangeContext(isDesktop));
		context.set('bidders.prebid.kargo', getKargoContext(isDesktop));
		context.set('bidders.prebid.medianet', getMedianetContext(isDesktop));
		context.set('bidders.prebid.mgnipbs', getMagniteS2sContext(isDesktop));
		context.set('bidders.prebid.openx', getOpenXContext(isDesktop));
		context.set('bidders.prebid.pubmatic', getPubmaticContext(isDesktop));
		context.set('bidders.prebid.rubicon_display', getRubiconDisplayContext(isDesktop));
		context.set('bidders.prebid.yahoossp', getYahooSspContext(isDesktop));

		this.registerListeners();
	}

	private registerListeners() {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				this.bidders.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}
}
