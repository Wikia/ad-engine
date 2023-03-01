import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getAppnexusContext } from '../../../bidders/prebid/appnexus';
import { getAppnexusAstContext } from '../../../bidders/prebid/appnexus-ast';
import { getFreewheelContext } from '../../../bidders/prebid/freewheel';
import { getGumgumContext } from '../../../bidders/prebid/gumgum';
import { getIndexExchangeContext } from '../../../bidders/prebid/index-exchange';
import { getKargoContext } from '../../../bidders/prebid/kargo';
import { getMedianetContext } from '../../../bidders/prebid/medianet';
import { getNobidContext } from '../../../bidders/prebid/nobid';
import { getOguryContext } from '../../../bidders/prebid/ogury';
import { getOneVideoContext } from '../../../bidders/prebid/one-video';
import { getPubmaticContext } from '../../../bidders/prebid/pubmatic';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/prebid/rubicon-display';
import { getRubiconPGContext } from '../../../bidders/prebid/rubicon-pg';
import { getTripleliftContext } from '../../../bidders/prebid/triplelift';
import { getVerizonContext } from '../../../bidders/prebid/verizon';
import { getWikiaContext } from '../../../bidders/prebid/wikia';
import { getWikiaVideoContext } from '../../../bidders/prebid/wikia-video';

@Injectable()
export class UcpMobilePrebidConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.prebid.appnexus', getAppnexusContext());
		context.set('bidders.prebid.appnexusAst', getAppnexusAstContext());
		context.set('bidders.prebid.freewheel', getFreewheelContext());
		context.set('bidders.prebid.gumgum', getGumgumContext());
		context.set('bidders.prebid.indexExchange', getIndexExchangeContext());
		context.set('bidders.prebid.kargo', getKargoContext());
		context.set('bidders.prebid.medianet', getMedianetContext());
		context.set('bidders.prebid.nobid', getNobidContext());
		context.set('bidders.prebid.ogury', getOguryContext());
		context.set('bidders.prebid.onevideo', getOneVideoContext());
		context.set('bidders.prebid.pubmatic', getPubmaticContext());
		context.set('bidders.prebid.rubicon', getRubiconContext());
		context.set('bidders.prebid.rubicon_display', getRubiconDisplayContext());
		context.set('bidders.prebid.rubicon_pg', getRubiconPGContext());
		context.set('bidders.prebid.triplelift', getTripleliftContext());
		context.set('bidders.prebid.verizon', getVerizonContext());
		context.set('bidders.prebid.wikia', getWikiaContext());
		context.set('bidders.prebid.wikiaVideo', getWikiaVideoContext());
	}
}
