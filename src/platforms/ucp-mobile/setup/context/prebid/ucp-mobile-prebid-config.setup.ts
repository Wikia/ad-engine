import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getAppnexusContext } from '../../../bidders/prebid/appnexus';
import { getAppnexusAstContext } from '../../../bidders/prebid/appnexus-ast';
import { getFreewheelContext } from '../../../bidders/prebid/freewheel';
import { getGumgumContext } from '../../../bidders/prebid/gumgum';
import { getIndexExchangeContext } from '../../../bidders/prebid/index-exchange';
import { getKargoContext } from '../../../bidders/prebid/kargo';
import { getMagniteS2sContext } from '../../../bidders/prebid/magniteS2s';
import { getMedianetContext } from '../../../bidders/prebid/medianet';
import { getNobidContext } from '../../../bidders/prebid/nobid';
import { getOguryContext } from '../../../bidders/prebid/ogury';
import { getOpenXContext } from '../../../bidders/prebid/openx';
import { getOzoneContext } from '../../../bidders/prebid/ozone';
import { getPubmaticContext } from '../../../bidders/prebid/pubmatic';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';
import { getRubiconDisplayContext } from '../../../bidders/prebid/rubicon-display';
import { getTripleliftContext } from '../../../bidders/prebid/triplelift';
import { getVerizonContext } from '../../../bidders/prebid/verizon';
import { getWebadsContext } from '../../../bidders/prebid/webads';
import { getWikiaContext } from '../../../bidders/prebid/wikia';
import { getWikiaVideoContext } from '../../../bidders/prebid/wikia-video';

function filterVideoBids(bidderContext) {
	const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
	const bidConfigSlotNames = Object.keys(bidderContext.slots);
	const hasFeaturedBidConfig = bidderContext.slots && bidConfigSlotNames.includes('featured');
	const hasIncontentPlayerBidConfig =
		bidderContext.slots && bidConfigSlotNames.includes('incontent_player');

	if (hasFeaturedVideo && hasIncontentPlayerBidConfig) {
		const newVideoSlotsConfig = {
			...bidderContext.slots,
		};
		delete newVideoSlotsConfig['incontent_player'];

		return {
			...bidderContext,
			slots: newVideoSlotsConfig,
		};
	} else if (!hasFeaturedVideo && hasFeaturedBidConfig) {
		const newVideoSlotsConfig = {
			...bidderContext.slots,
		};
		delete newVideoSlotsConfig['featured'];

		return {
			...bidderContext,
			slots: newVideoSlotsConfig,
		};
	}

	return bidderContext;
}

@Injectable()
export class UcpMobilePrebidConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.prebid.appnexus', filterVideoBids(getAppnexusContext()));
		context.set('bidders.prebid.appnexusAst', filterVideoBids(getAppnexusAstContext()));
		context.set('bidders.prebid.freewheel', filterVideoBids(getFreewheelContext()));
		context.set('bidders.prebid.gumgum', filterVideoBids(getGumgumContext()));
		context.set('bidders.prebid.indexExchange', filterVideoBids(getIndexExchangeContext()));
		context.set('bidders.prebid.kargo', filterVideoBids(getKargoContext()));
		context.set('bidders.prebid.mgnipbs', filterVideoBids(getMagniteS2sContext()));
		context.set('bidders.prebid.medianet', filterVideoBids(getMedianetContext()));
		context.set('bidders.prebid.nobid', filterVideoBids(getNobidContext()));
		context.set('bidders.prebid.ogury', filterVideoBids(getOguryContext()));
		context.set('bidders.prebid.openx', filterVideoBids(getOpenXContext()));
		context.set('bidders.prebid.ozone', filterVideoBids(getOzoneContext()));
		context.set('bidders.prebid.pubmatic', filterVideoBids(getPubmaticContext()));
		context.set('bidders.prebid.relevantdigital', filterVideoBids(getWebadsContext()));
		context.set('bidders.prebid.rubicon', filterVideoBids(getRubiconContext()));
		context.set('bidders.prebid.rubicon_display', filterVideoBids(getRubiconDisplayContext()));
		context.set('bidders.prebid.triplelift', filterVideoBids(getTripleliftContext()));
		context.set('bidders.prebid.verizon', filterVideoBids(getVerizonContext()));
		context.set('bidders.prebid.wikia', filterVideoBids(getWikiaContext()));
		context.set('bidders.prebid.wikiaVideo', filterVideoBids(getWikiaVideoContext()));
	}
}
