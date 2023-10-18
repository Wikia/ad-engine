import { filterVideoBids } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getAppnexusContext } from '../../../bidders/prebid/appnexus';
import { getAppnexusAstContext } from '../../../bidders/prebid/appnexus-ast';
import { getFreewheelContext } from '../../../bidders/prebid/freewheel';
import { getIndexExchangeContext } from '../../../bidders/prebid/index-exchange';
import { getKargoContext } from '../../../bidders/prebid/kargo';
import { getMagniteS2sContext } from '../../../bidders/prebid/magniteS2s';
import { getMedianetContext } from '../../../bidders/prebid/medianet';
import { getNobidContext } from '../../../bidders/prebid/nobid';
import { getOpenXContext } from '../../../bidders/prebid/openx';
import { getOzoneContext } from '../../../bidders/prebid/ozone';
import { getPubmaticContext } from '../../../bidders/prebid/pubmatic';
import { getRoundelContext } from '../../../bidders/prebid/roundel';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/prebid/rubicon-display';
import { getTripleliftContext } from '../../../bidders/prebid/triplelift';
import { getVerizonContext } from '../../../bidders/prebid/verizon';
import { getWebadsContext } from '../../../bidders/prebid/webads';
import { getWikiaContext } from '../../../bidders/prebid/wikia';
import { getWikiaVideoContext } from '../../../bidders/prebid/wikia-video';

@Injectable()
export class UcpDesktopPrebidConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.prebid.appnexus', filterVideoBids(getAppnexusContext()));
		context.set('bidders.prebid.appnexusAst', filterVideoBids(getAppnexusAstContext()));
		context.set('bidders.prebid.indexExchange', filterVideoBids(getIndexExchangeContext()));
		context.set('bidders.prebid.freewheel', filterVideoBids(getFreewheelContext()));
		context.set('bidders.prebid.kargo', filterVideoBids(getKargoContext()));
		context.set('bidders.prebid.medianet', filterVideoBids(getMedianetContext()));
		context.set('bidders.prebid.mgnipbs', filterVideoBids(getMagniteS2sContext()));
		context.set('bidders.prebid.nobid', filterVideoBids(getNobidContext()));
		context.set('bidders.prebid.openx', filterVideoBids(getOpenXContext()));
		context.set('bidders.prebid.ozone', filterVideoBids(getOzoneContext()));
		context.set('bidders.prebid.pubmatic', filterVideoBids(getPubmaticContext()));
		context.set('bidders.prebid.roundel', filterVideoBids(getRoundelContext()));
		context.set('bidders.prebid.rubicon', filterVideoBids(getRubiconContext()));
		context.set('bidders.prebid.rubicon_display', filterVideoBids(getRubiconDisplayContext()));
		context.set('bidders.prebid.triplelift', filterVideoBids(getTripleliftContext()));
		context.set('bidders.prebid.verizon', filterVideoBids(getVerizonContext()));
		context.set('bidders.prebid.relevantdigital', filterVideoBids(getWebadsContext()));
		context.set('bidders.prebid.wikia', filterVideoBids(getWikiaContext()));
		context.set('bidders.prebid.wikiaVideo', filterVideoBids(getWikiaVideoContext()));
	}
}
