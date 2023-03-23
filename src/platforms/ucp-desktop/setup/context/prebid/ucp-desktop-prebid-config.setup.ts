import { context, DiProcess } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { getAppnexusContext } from '../../../bidders/prebid/appnexus';
import { getAppnexusAstContext } from '../../../bidders/prebid/appnexus-ast';
import { getFreewheelContext } from '../../../bidders/prebid/freewheel';
import { getIndexExchangeContext } from '../../../bidders/prebid/index-exchange';
import { getMedianetContext } from '../../../bidders/prebid/medianet';
import { getNobidContext } from '../../../bidders/prebid/nobid';
import { getOneVideoContext } from '../../../bidders/prebid/one-video';
import { getPubmaticContext } from '../../../bidders/prebid/pubmatic';
import { getRoundelContext } from '../../../bidders/prebid/roundel';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/prebid/rubicon-display';
import { getTripleliftContext } from '../../../bidders/prebid/triplelift';
import { getVerizonContext } from '../../../bidders/prebid/verizon';
import { getWikiaContext } from '../../../bidders/prebid/wikia';
import { getWikiaVideoContext } from '../../../bidders/prebid/wikia-video';

@injectable()
export class UcpDesktopPrebidConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.prebid.appnexus', getAppnexusContext());
		context.set('bidders.prebid.appnexusAst', getAppnexusAstContext());
		context.set('bidders.prebid.indexExchange', getIndexExchangeContext());
		context.set('bidders.prebid.freewheel', getFreewheelContext());
		context.set('bidders.prebid.medianet', getMedianetContext());
		context.set('bidders.prebid.nobid', getNobidContext());
		context.set('bidders.prebid.onevideo', getOneVideoContext());
		context.set('bidders.prebid.pubmatic', getPubmaticContext());
		context.set('bidders.prebid.roundel', getRoundelContext());
		context.set('bidders.prebid.rubicon', getRubiconContext());
		context.set('bidders.prebid.rubicon_display', getRubiconDisplayContext());
		context.set('bidders.prebid.triplelift', getTripleliftContext());
		context.set('bidders.prebid.verizon', getVerizonContext());
		context.set('bidders.prebid.wikia', getWikiaContext());
		context.set('bidders.prebid.wikiaVideo', getWikiaVideoContext());
	}
}
