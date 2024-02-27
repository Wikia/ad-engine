import { filterVideoBids } from '@platforms/shared';
import { context, DiProcess, InstantConfigService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getAppnexusContext } from '../../../bidders/prebid/appnexus';
import { getAppnexusAstContext } from '../../../bidders/prebid/appnexus-ast';
import { getIndexExchangeContext } from '../../../bidders/prebid/index-exchange';
import { getKargoContext } from '../../../bidders/prebid/kargo';
import { getMagniteS2sContext } from '../../../bidders/prebid/magniteS2s';
import { getPubmaticContext } from '../../../bidders/prebid/pubmatic';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/prebid/rubicon-display';
import { getTripleliftContext } from '../../../bidders/prebid/triplelift';
import { getWebadsContext } from '../../../bidders/prebid/webads';
import { getWikiaContext } from '../../../bidders/prebid/wikia';
import { getWikiaVideoContext } from '../../../bidders/prebid/wikia-video';

@Injectable()
export class UcpDesktopPrebidConfigSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	execute(): void {
		const icMagniteS2sVideo = !!this.instantConfig.get<boolean>('icMagniteS2sVideo');

		context.set('bidders.prebid.appnexus', filterVideoBids(getAppnexusContext()));
		context.set('bidders.prebid.appnexusAst', filterVideoBids(getAppnexusAstContext()));
		context.set('bidders.prebid.indexExchange', filterVideoBids(getIndexExchangeContext()));
		context.set('bidders.prebid.kargo', filterVideoBids(getKargoContext()));
		context.set('bidders.prebid.mgnipbs', filterVideoBids(getMagniteS2sContext(icMagniteS2sVideo)));
		context.set('bidders.prebid.pubmatic', filterVideoBids(getPubmaticContext()));
		context.set('bidders.prebid.rubicon', filterVideoBids(getRubiconContext()));
		context.set('bidders.prebid.rubicon_display', filterVideoBids(getRubiconDisplayContext()));
		context.set('bidders.prebid.triplelift', filterVideoBids(getTripleliftContext()));
		context.set('bidders.prebid.relevantdigital', filterVideoBids(getWebadsContext()));
		context.set('bidders.prebid.wikia', filterVideoBids(getWikiaContext()));
		context.set('bidders.prebid.wikiaVideo', filterVideoBids(getWikiaVideoContext()));
	}
}
