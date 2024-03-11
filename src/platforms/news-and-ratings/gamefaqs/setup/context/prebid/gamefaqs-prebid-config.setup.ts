import {
	Bidders,
	communicationService,
	context,
	DiProcess,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getAppnexusContext } from '../../../bidders/appnexus';
import { getAppnexusAstContext } from '../../../bidders/appnexus-ast';
import { getCriteoContext } from '../../../bidders/criteo';
import { getIndexExchangeContext } from '../../../bidders/index-exchange';
import { getKargoContext } from '../../../bidders/kargo';
import { getMagniteS2sContext } from '../../../bidders/magniteS2s';
import { getMedianetContext } from '../../../bidders/medianet';
import { getOpenXContext } from '../../../bidders/openx';
import { getPubmaticContext } from '../../../bidders/pubmatic';
import { getRubiconContext } from '../../../bidders/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/rubicon-display';
import { getWikiaContext } from '../../../bidders/wikia';
import { getYahooSspContext } from '../../../bidders/yahoossp';
import { AD_ENGINE_SLOT_ADDED } from "../../../../../../communication/events/events-ad-engine-slot";

@Injectable()
export class GamefaqsPrebidConfigSetup implements DiProcess {
	constructor(private bidders: Bidders) {}

	execute(): void {
		const isDesktop = !context.get('state.isMobile');

		context.set('bidders.prebid.appnexus', getAppnexusContext(isDesktop));
		context.set('bidders.prebid.appnexusAst', getAppnexusAstContext(isDesktop));
		context.set('bidders.prebid.criteo', getCriteoContext(isDesktop));
		context.set('bidders.prebid.indexExchange', getIndexExchangeContext(isDesktop));
		context.set('bidders.prebid.kargo', getKargoContext(isDesktop));
		context.set('bidders.prebid.medianet', getMedianetContext(isDesktop));
		context.set('bidders.prebid.mgnipbs', getMagniteS2sContext(isDesktop));
		context.set('bidders.prebid.openx', getOpenXContext(isDesktop));
		context.set('bidders.prebid.pubmatic', getPubmaticContext(isDesktop));
		context.set('bidders.prebid.rubicon', getRubiconContext(isDesktop));
		context.set('bidders.prebid.rubicon_display', getRubiconDisplayContext(isDesktop));
		context.set('bidders.prebid.wikia', getWikiaContext());
		context.set('bidders.prebid.yahoossp', getYahooSspContext(isDesktop));
		context.set('bidders.prebid.filter', 'static');

		this.registerListeners();
	}

	private registerListeners() {
		communicationService.on(
			AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				this.bidders.updateSlotTargeting(slot.getSlotName());
			},
			false,
		);
	}
}
