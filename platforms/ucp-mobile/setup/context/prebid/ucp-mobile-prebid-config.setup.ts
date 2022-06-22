import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getAppnexusContext } from '../../../bidders/prebid/appnexus';
import { getAppnexusAstContext } from '../../../bidders/prebid/appnexus-ast';
import { getAppnexusGroupMContext } from '../../../bidders/prebid/appnexus-group-m';
import { getBeachfrontContext } from '../../../bidders/prebid/beachfront';
import { getGumgumContext } from '../../../bidders/prebid/gumgum';
import { getIndexExchangeContext } from '../../../bidders/prebid/index-exchange';
import { getKargoContext } from '../../../bidders/prebid/kargo';
import { getMediagridContext } from '../../../bidders/prebid/mediagrid';
import { getNobidContext } from '../../../bidders/prebid/nobid';
import { getOneVideoContext } from '../../../bidders/prebid/one-video';
import { getOpenXContext } from '../../../bidders/prebid/openx';
import { getPubmaticContext } from '../../../bidders/prebid/pubmatic';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/prebid/rubicon-display';
import { getTelariaContext } from '../../../bidders/prebid/telaria';
import { getTripleliftContext } from '../../../bidders/prebid/triplelift';
import { getTripleliftNativeContext } from '../../../bidders/prebid/triplelift-native';
import { getVerizonContext } from '../../../bidders/prebid/verizon';
import { getWikiaContext } from '../../../bidders/prebid/wikia';
import { getWikiaVideoContext } from '../../../bidders/prebid/wikia-video';

@Injectable()
export class UcpMobilePrebidConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.prebid.appnexus', getAppnexusContext());
		context.set('bidders.prebid.appnexusAst', getAppnexusAstContext());
		context.set('bidders.prebid.appnexusGroupM', getAppnexusGroupMContext());
		context.set('bidders.prebid.beachfront', getBeachfrontContext());
		context.set('bidders.prebid.gumgum', getGumgumContext());
		context.set('bidders.prebid.indexExchange', getIndexExchangeContext());
		context.set('bidders.prebid.kargo', getKargoContext());
		context.set('bidders.prebid.mediagrid', getMediagridContext());
		context.set('bidders.prebid.nobid', getNobidContext());
		context.set('bidders.prebid.onevideo', getOneVideoContext());
		context.set('bidders.prebid.openx', getOpenXContext());
		context.set('bidders.prebid.pubmatic', getPubmaticContext());
		context.set('bidders.prebid.rubicon', getRubiconContext());
		context.set('bidders.prebid.rubicon_display', getRubiconDisplayContext());
		context.set('bidders.prebid.telaria', getTelariaContext());
		context.set('bidders.prebid.triplelift', getTripleliftContext());
		context.set('bidders.prebid.triplelift_native', getTripleliftNativeContext());
		context.set('bidders.prebid.verizon', getVerizonContext());
		context.set('bidders.prebid.wikia', getWikiaContext());
		context.set('bidders.prebid.wikiaVideo', getWikiaVideoContext());
	}
}
