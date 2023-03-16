import {
	Bidders,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { getAppnexusContext } from '../../../bidders/appnexus';
import { getAppnexusAstContext } from '../../../bidders/appnexus-ast';
import { getCriteoContext } from '../../../bidders/criteo';
import { getIndexExchangeContext } from '../../../bidders/index-exchange';
import { getKargoContext } from '../../../bidders/kargo';
import { getMedianetContext } from '../../../bidders/medianet';
import { getPubmaticContext } from '../../../bidders/pubmatic';
import { getRubiconContext } from '../../../bidders/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/rubicon-display';
import { getWikiaContext } from '../../../bidders/wikia';
import { getYahooSspContext } from '../../../bidders/yahoossp';

@Injectable()
export class TvGuidePrebidConfigSetup implements DiProcess {
	constructor(private bidders: Bidders) {}

	execute(): void {
		const isDesktop = !context.get('state.isMobile');

		context.set('bidders.prebid.appnexus', getAppnexusContext(isDesktop));
		context.set('bidders.prebid.appnexusAst', getAppnexusAstContext(isDesktop));
		context.set('bidders.prebid.criteo', getCriteoContext(isDesktop));
		context.set('bidders.prebid.indexExchange', getIndexExchangeContext(isDesktop));
		context.set('bidders.prebid.kargo', getKargoContext(isDesktop));
		context.set('bidders.prebid.medianet', getMedianetContext(isDesktop));
		context.set('bidders.prebid.pubmatic', getPubmaticContext(isDesktop));
		context.set('bidders.prebid.rubicon', getRubiconContext(isDesktop));
		context.set('bidders.prebid.rubicon_display', getRubiconDisplayContext(isDesktop));
		context.set('bidders.prebid.wikia', getWikiaContext());
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
